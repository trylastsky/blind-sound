'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { soundDescriptions, obstacleDescriptions } from "./descriptions";
import { AlertTriangle, AudioWaveform, Box, Boxes, CheckCircle2, DraftingCompass, Hourglass, Play, Ruler, Search, Square, StopCircle, TriangleRight } from 'lucide-react';
import { StatsData } from '@/app/page';
import { createFallbackSound } from '@/app/services/audio/createFallbackSound';
import ThreeScene from '../ThreeScene';
import { CustomSelect } from '../CustomSelect';
import { Point } from '@/app/types/canvas/Point';
import { TrainerSettings } from '@/app/types/settings/TrainerSettings';
import { SoundType } from '@/app/types/audio/SoundType';
import { ObstacleType } from '@/app/types/canvas/Obstacle';
import { useLocalStorage } from '@/app/hooks/useLocalStorage';

interface SoundTrainerProps {
    stats: StatsData;
    setStats: (stats: StatsData | ((prev: StatsData) => StatsData)) => void;
    currentMode: '2d' | '3d';
}

// Начальные настройки по умолчанию
const defaultSettings: TrainerSettings = {
    difficulty: 'easy',
    obstacleType: 'none',
    soundType: 'kalimba',
    volume: 0.7
};

export default function SoundTrainer({ setStats, currentMode }: SoundTrainerProps) {
    const [soundSource, setSoundSource] = useState<Point | null>(null);
    const [userGuess, setUserGuess] = useState<Point | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const [statusFind, setStatusFind] = useState<boolean>(false);
    const [settings, setSettings, isSettingsLoaded] = useLocalStorage<TrainerSettings>(
        'soundTrainerSettings', 
        defaultSettings
    );

    const audioContextRef = useRef<AudioContext | null>(null);
    const soundBuffersRef = useRef<Map<SoundType, AudioBuffer>>(new Map());
    const currentSourceRef = useRef<AudioBufferSourceNode | null>(null);
    const settingsRef = useRef(settings);

    const canvasSize = 400;
    const center = canvasSize / 2;
    const radius = 150;

    useEffect(() => {
        settingsRef.current = settings;
    }, [settings]);

    // Функции для обновления настроек
    const setDifficulty = (difficulty: 'easy' | 'medium' | 'hard') => {
        setSettings(prev => ({ ...prev, difficulty }));
    };

    const setObstacleType = (obstacleType: ObstacleType) => {
        setSettings(prev => ({ ...prev, obstacleType }));
    };

    const setSoundType = (soundType: SoundType) => {
        setSettings(prev => ({ ...prev, soundType }));
    };

    const setVolume = (volume: number) => {
        setSettings(prev => ({ ...prev, volume }));
    };

    const initAudio = useCallback(async () => {
        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext)();
        }

        const soundsToLoad: SoundType[] = Object.keys(soundDescriptions) as SoundType[];

        for (const type of soundsToLoad) {
            if (!soundBuffersRef.current.has(type)) {
                const buffer = createFallbackSound(type, audioContextRef);
                soundBuffersRef.current.set(type, buffer);
            }
        }
    }, []);

    const stopCurrentSound = useCallback(() => {
        if (currentSourceRef.current) {
            try {
                currentSourceRef.current.stop();
            } catch { }
            currentSourceRef.current = null;
        }
        setIsPlaying(false);
    }, []);

    const playSound = useCallback(async (point: Point) => {
        try {
            stopCurrentSound();

            await initAudio();

            if (!audioContextRef.current) {
                return;
            }

            const currentSettings = settingsRef.current;
            const buffer = soundBuffersRef.current.get(currentSettings.soundType);
            if (!buffer) {
                return;
            }

            const source = audioContextRef.current.createBufferSource();
            source.buffer = buffer;
            currentSourceRef.current = source;

            const panner = audioContextRef.current.createStereoPanner();
            const normalizedX = (point.x - center) / radius;
            const pan = Math.max(-1, Math.min(1, normalizedX));
            panner.pan.value = pan;

            const gainNode = audioContextRef.current.createGain();
            gainNode.gain.value = currentSettings.volume;

            source.connect(gainNode);
            gainNode.connect(panner);
            panner.connect(audioContextRef.current.destination);

            if (currentSettings.obstacleType !== 'none') {
                const filter = audioContextRef.current.createBiquadFilter();
                switch (currentSettings.obstacleType) {
                    case 'wall':
                        filter.type = 'lowpass';
                        filter.frequency.value = 1500;
                        break;
                    case 'pillar':
                        filter.type = 'bandpass';
                        filter.frequency.value = 1000;
                        break;
                    case 'corner':
                        filter.type = 'highpass';
                        filter.frequency.value = 500;
                        break;
                    case 'tunnel':
                        filter.type = 'lowshelf';
                        filter.frequency.value = 800;
                        filter.gain.value = -8;
                        break;
                }

                if (currentSettings.obstacleType !== 'maze') {
                    gainNode.disconnect();
                    gainNode.connect(filter);
                    filter.connect(panner);
                }
            }

            if (currentMode === '3d' && point.z !== undefined) {
                const distanceGain = audioContextRef.current.createGain();
                const distanceFactor = Math.max(0.3, 1 - Math.abs(point.z) * 0.5);
                distanceGain.gain.value = distanceFactor;

                gainNode.disconnect();
                gainNode.connect(distanceGain);
                distanceGain.connect(panner);
            }

            source.start();
            setIsPlaying(true);

            source.onended = () => {
                setIsPlaying(false);
                currentSourceRef.current = null;
            };

        } catch {
            setIsPlaying(false);
        }
    }, [center, radius, currentMode, initAudio, stopCurrentSound]);

    const generateRandomPoint = useCallback((): Point => {
        const currentSettings = settingsRef.current;
        const angle = Math.random() * 2 * Math.PI;
        const distance = currentSettings.difficulty === 'easy' ? radius * 0.7 :
            currentSettings.difficulty === 'medium' ? radius * 0.85 : radius;

        const basePoint = {
            x: center + Math.cos(angle) * distance,
            y: center + Math.sin(angle) * distance
        };

        if (currentMode === '3d') {
            return {
                ...basePoint,
                z: (Math.random() - 0.5) * 2
            };
        }

        return basePoint;
    }, [center, radius, currentMode]);

    const startNewRound = useCallback(() => {
        const newSource = generateRandomPoint();
        setSoundSource(newSource);
        setStatusFind(true);
        setUserGuess(null);
        setShowResult(false);

        setTimeout(() => {
            playSound(newSource);
        }, 300);
    }, [generateRandomPoint, playSound]);

    const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
        if (!statusFind || isPlaying) return;

        const canvas = event.currentTarget;
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        const clickPoint: Point = {
            x: (event.clientX - rect.left) * scaleX,
            y: (event.clientY - rect.top) * scaleY
        };

        handleGuess(clickPoint);
    };

    const handle3DPointSelect = (point: Point) => {
        handleGuess(point);
    };

    const handleGuess = (guessPoint: Point) => {
        setUserGuess(guessPoint);
        setShowResult(true);
        setStatusFind(false);

        let distance: number;
        if (currentMode === '3d' && soundSource?.z !== undefined) {
            distance = Math.sqrt(
                Math.pow(guessPoint.x - soundSource.x, 2) +
                Math.pow(guessPoint.y - soundSource.y, 2) +
                Math.pow((guessPoint.z || 0) - (soundSource.z || 0), 2) * 100
            );
        } else {
            distance = Math.sqrt(
                Math.pow(guessPoint.x - soundSource!.x, 2) +
                Math.pow(guessPoint.y - soundSource!.y, 2)
            );
        }

        const currentSettings = settingsRef.current;
        const threshold = currentSettings.difficulty === 'easy' ? 50 :
            currentSettings.difficulty === 'medium' ? 35 : 20;
        const isCorrect = distance < threshold;

        setStats(prev => {
            const modeKey = currentMode;
            const modeStat = prev.modeStats[modeKey];

            const newStreak = isCorrect ? modeStat.currentStreak + 1 : 0;
            const newModeStat = {
                ...modeStat,
                totalAttempts: modeStat.totalAttempts + 1,
                correctAttempts: modeStat.correctAttempts + (isCorrect ? 1 : 0),
                currentStreak: newStreak,
                bestStreak: Math.max(modeStat.bestStreak, newStreak)
            };

            const totalCorrect = prev.modeStats['2d'].correctAttempts + prev.modeStats['3d'].correctAttempts;
            const totalAttempts = prev.modeStats['2d'].totalAttempts + prev.modeStats['3d'].totalAttempts;

            return {
                ...prev,
                totalAttempts,
                correctAttempts: totalCorrect,
                currentStreak: isCorrect ? prev.currentStreak + 1 : 0,
                bestStreak: Math.max(prev.bestStreak, isCorrect ? prev.currentStreak + 1 : 0),
                modeStats: {
                    ...prev.modeStats,
                    [modeKey]: newModeStat
                }
            };
        });
    };

    const stopSound = useCallback(() => {
        stopCurrentSound();
    }, [stopCurrentSound]);

    const drawObstacles = useCallback((ctx: CanvasRenderingContext2D) => {
        const currentSettings = settingsRef.current;

        ctx.fillStyle = 'rgba(100, 100, 100, 0.7)';
        ctx.strokeStyle = 'rgba(150, 150, 150, 0.9)';
        ctx.lineWidth = 2;

        switch (currentSettings.obstacleType) {
            case 'wall':
                ctx.fillRect(center - 80, center - 10, 160, 20);
                break;
            case 'pillar':
                ctx.beginPath();
                ctx.arc(center - 60, center - 60, 15, 0, 2 * Math.PI);
                ctx.arc(center + 60, center + 60, 15, 0, 2 * Math.PI);
                ctx.arc(center + 60, center - 60, 15, 0, 2 * Math.PI);
                ctx.arc(center - 60, center + 60, 15, 0, 2 * Math.PI);
                ctx.fill();
                break;
            case 'corner':
                ctx.fillRect(center - 100, center - 100, 60, 60);
                break;
            case 'tunnel':
                ctx.beginPath();
                ctx.arc(center, center, 80, 0, 2 * Math.PI);
                ctx.arc(center, center, 50, 0, 2 * Math.PI);
                ctx.fill('evenodd');
                break;
            case 'maze':
                ctx.fillRect(center - 90, center - 90, 30, 180);
                ctx.fillRect(center + 60, center - 90, 30, 180);
                ctx.fillRect(center - 60, center - 30, 120, 20);
                ctx.fillRect(center - 60, center + 10, 120, 20);
                break;
        }
    }, [center]);

    useEffect(() => {
        if (currentMode !== '2d') return;

        const canvas = document.getElementById('soundCanvas') as HTMLCanvasElement;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, canvasSize, canvasSize);
        ctx.fillStyle = 'rgba(30, 41, 59, 0.8)';
        ctx.fillRect(0, 0, canvasSize, canvasSize);

        ctx.strokeStyle = '#4ade80';
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.arc(center, center, radius, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.setLineDash([]);

        if (settings.obstacleType !== 'none') {
            drawObstacles(ctx);
        }

        if (showResult && soundSource) {
            ctx.fillStyle = '#4ade80';
            ctx.beginPath();
            ctx.arc(soundSource.x, soundSource.y, 8, 0, 2 * Math.PI);
            ctx.fill();
        }

        if (userGuess) {
            ctx.fillStyle = showResult ? '#f87171' : '#60a5fa';
            ctx.beginPath();
            ctx.arc(userGuess.x, userGuess.y, 6, 0, 2 * Math.PI);
            ctx.fill();
        }

        if (showResult && soundSource && userGuess) {
            ctx.strokeStyle = '#94a3b8';
            ctx.setLineDash([2, 2]);
            ctx.beginPath();
            ctx.moveTo(soundSource.x, soundSource.y);
            ctx.lineTo(userGuess.x, userGuess.y);
            ctx.stroke();
            ctx.setLineDash([]);
        }
    }, [soundSource, userGuess, showResult, center, radius, settings.obstacleType, currentMode, drawObstacles]);

    const calculateDistanceInMeters = (point1: Point, point2: Point, is3D: boolean = false): number => {
        const pixelDistance = is3D && point1.z !== undefined && point2.z !== undefined
            ? Math.sqrt(
                Math.pow(point1.x - point2.x, 2) +
                Math.pow(point1.y - point2.y, 2) +
                Math.pow((point1.z || 0) - (point2.z || 0), 2) * 100
            )
            : Math.sqrt(
                Math.pow(point1.x - point2.x, 2) +
                Math.pow(point1.y - point2.y, 2)
            );

        return pixelDistance * 0.02;
    };

    const soundOptions = Object.entries(soundDescriptions).map(([key, { icon, name }]) => ({
        value: key,
        label: name,
        icon: icon
    }));

    const obstacleOptions = Object.entries(obstacleDescriptions).map(([key, { icon, name }]) => ({
        value: key,
        label: name,
        icon: icon
    }));

    const difficultyOptions = [
        { value: 'easy', label: 'Легкая', icon: <div className="w-4 h-4 bg-green-500 rounded-full" /> },
        { value: 'medium', label: 'Средняя', icon: <div className="w-4 h-4 bg-yellow-500 rounded-full" /> },
        { value: 'hard', label: 'Сложная', icon: <div className="w-4 h-4 bg-red-500 rounded-full" /> }
    ];

    if (!isSettingsLoaded) {
        return (
            <div className="flex flex-col items-center justify-center space-y-8">
                <div className="bg-linear-to-br from-gray-900 via-blue-900 to-purple-900 rounded-2xl p-8 w-full max-w-4xl border-2 border-purple-500/30 shadow-2xl text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                    <p className="text-blue-200">Загрузка настроек...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center space-y-8">
            <div className="bg-linear-to-br from-gray-900 via-blue-900 to-purple-900 rounded-2xl p-6 w-full max-w-4xl border-2 border-purple-500/30 shadow-2xl">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div>
                        <label className="flex items-center gap-2 text-sm font-semibold mb-3 text-blue-200 uppercase tracking-wide">
                            <DraftingCompass className='w-4 h-4' />
                            Сложность
                        </label>
                        <CustomSelect
                            value={settings.difficulty}
                            onChange={(value) => setDifficulty(value as 'easy' | 'medium' | 'hard')}
                            options={difficultyOptions}
                            className="w-full"
                        />
                    </div>

                    <div>
                        <label className="flex items-center gap-2 text-sm font-semibold mb-3 text-purple-200 uppercase tracking-wide">
                            <AudioWaveform className='w-4 h-4' />
                            Тип звука
                        </label>
                        <CustomSelect
                            value={settings.soundType}
                            onChange={(value) => setSoundType(value as SoundType)}
                            options={soundOptions}
                            className="w-full"
                        />
                    </div>

                    <div>
                        <label className="flex items-center gap-2 text-sm font-semibold mb-3 text-red-200 uppercase tracking-wide">
                            <Boxes className='w-4 h-4' />
                            Препятствия
                        </label>
                        <CustomSelect
                            value={settings.obstacleType}
                            onChange={(value) => setObstacleType(value as ObstacleType)}
                            options={obstacleOptions}
                            className="w-full"
                        />
                    </div>

                    <div className="flex flex-col justify-end space-y-1">
                        <div className="flex items-center gap-2 text-sm text-blue-300 bg-blue-800/50 px-3 py-2 rounded-lg border border-blue-600/30">
                            {currentMode === '2d' ? <Square className='w-4 h-4' /> : <Box className='w-4 h-4' />}
                            <strong>Режим: {currentMode.toUpperCase()}</strong>
                        </div>
                        <div className="text-sm bg-purple-800/50 px-3 py-2 rounded-lg border border-purple-600/30">
                            <strong className={statusFind ? 'text-green-400' : 'text-yellow-400'}>
                                {statusFind ?
                                    <span className='flex gap-2 items-center'><Search className='w-4 h-4' />Поиск</span> :
                                    <span className='flex gap-2 items-center'><Hourglass className='w-4 h-4' />Ожидание</span>
                                }
                            </strong>
                        </div>
                    </div>
                </div>

                <div className="mb-6">
                    <label className="flex items-center gap-2 text-sm font-semibold mb-3 text-green-200 uppercase tracking-wide">
                        <TriangleRight className='w-4 h-4' /> Громкость: {Math.round(settings.volume * 100)}%
                    </label>
                    <div className="relative">
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={settings.volume}
                            onChange={(e) => setVolume(parseFloat(e.target.value))}
                            className="w-full h-3 bg-linear-to-r from-blue-600 to-purple-600 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-purple-500 [&::-webkit-slider-thumb]:shadow-lg"
                        />
                        <div className="flex justify-between text-xs text-blue-300 mt-2">
                            <span>0%</span>
                            <span>50%</span>
                            <span>100%</span>
                        </div>
                    </div>
                </div>

                {/* Current Selection Display */}
                <div className="text-center text-blue-200 text-sm mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center justify-center gap-3 bg-blue-800/30 p-3 rounded-xl border border-blue-600/30">
                        <div className="text-purple-300">
                            {soundDescriptions[settings.soundType].icon}
                        </div>
                        <div className="text-left">
                            <div className="font-semibold text-white">{soundDescriptions[settings.soundType].name}</div>
                            <div className="text-blue-300 text-xs">{soundDescriptions[settings.soundType].desc}</div>
                        </div>
                    </div>
                    <div className="flex items-center justify-center gap-3 bg-purple-800/30 p-3 rounded-xl border border-purple-600/30">
                        <div className="text-red-300">
                            {obstacleDescriptions[settings.obstacleType].icon}
                        </div>
                        <div className="text-left">
                            <div className="font-semibold text-white">{obstacleDescriptions[settings.obstacleType].name}</div>
                            <div className="text-purple-300 text-xs">{obstacleDescriptions[settings.obstacleType].desc}</div>
                        </div>
                    </div>
                </div>

                <div className="flex space-x-4">
                    <button
                        onClick={startNewRound}
                        disabled={isPlaying}
                        className="cursor-pointer flex-1 bg-linear-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 disabled:from-green-800 disabled:to-emerald-900 text-white font-bold py-4 rounded-xl transition-all duration-300 flex items-center justify-center space-x-3 shadow-lg border-2 border-green-500/30 disabled:border-green-800/30 disabled:cursor-not-allowed"
                    >
                        {isPlaying ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span>Воспроизведение</span>
                            </>
                        ) : (
                            <>
                                <Play className="w-5 h-5" />
                                <span>Новый звук</span>
                            </>
                        )}
                    </button>

                    {isPlaying && (
                        <button
                            onClick={stopSound}
                            className="cursor-pointer px-8 bg-linear-to-r from-red-600 to-pink-700 hover:from-red-700 hover:to-pink-800 text-white font-bold py-4 rounded-xl transition-all duration-300 flex items-center gap-3 shadow-lg border-2 border-red-500/30"
                        >
                            <StopCircle className="w-5 h-5" />
                            Стоп
                        </button>
                    )}
                </div>
            </div>

            {currentMode === '2d' ? (
                <div className="relative">
                    <canvas
                        id="soundCanvas"
                        width={canvasSize}
                        height={canvasSize}
                        onClick={handleCanvasClick}
                        className={`border-4 rounded-2xl ${statusFind ?
                            'cursor-crosshair border-green-500/50 shadow-2xl shadow-green-500/20' :
                            'cursor-not-allowed opacity-80 border-blue-500/30'
                            } bg-linear-to-br from-slate-900 to-blue-900 transition-all duration-700 hover:border-green-500/70`}
                        style={{ width: canvasSize, height: canvasSize }}
                    />

                    {showResult && soundSource && userGuess && (
                        <div className="absolute top-88 left-55 bg-black/80 backdrop-blur-sm p-2 rounded-xl border border-green-500/30 shadow-2xl">
                            <div className="flex gap-2 items-center justify-center text-sm font-semibold text-green-400">
                                <Ruler className='w-4 h-4' /> Расстояние: {calculateDistanceInMeters(userGuess, soundSource).toFixed(2)}м
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <ThreeScene
                    obstacleType={settings.obstacleType}
                    onPointSelect={handle3DPointSelect}
                    soundSource={showResult ? soundSource : null}
                    userGuess={userGuess}
                    showResult={showResult}
                    isInteractive={statusFind && !isPlaying}
                />
            )}

            <div className="text-center text-blue-200 max-w-md bg-blue-900/50 p-4 rounded-xl border border-blue-500/30">
                <p className="flex items-center justify-center gap-3 text-lg font-semibold">
                    {currentMode === '3d'
                        ? 'Кликните в 3D пространстве чтобы указать источник звука'
                        : 'Кликните на круге в том месте, откуда исходит звук'
                    }
                </p>
                {!statusFind && (
                    <p className="text-yellow-300 mt-3 flex items-center justify-center gap-3 text-sm bg-yellow-500/20 p-2 rounded-lg">
                        <AlertTriangle className="w-5 h-5" />
                        {`Нажмите "Новый звук" чтобы начать поиск`}
                    </p>
                )}
                {statusFind && (
                    <p className="text-green-300 mt-3 flex items-center justify-center gap-3 text-sm bg-green-500/20 p-2 rounded-lg">
                        <CheckCircle2 className="w-5 h-5" />
                        Можете кликать для указания источника звука
                    </p>
                )}
            </div>
        </div>
    );
}