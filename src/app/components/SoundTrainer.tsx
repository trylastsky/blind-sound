'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { StatsData } from '../page';
import ThreeScene from './ThreeScene';

interface Point {
    x: number;
    y: number;
    z?: number;
}

interface SoundTrainerProps {
    stats: StatsData;
    setStats: (stats: StatsData | ((prev: StatsData) => StatsData)) => void;
    currentMode: '2d' | '3d';
}

type SoundType = 'bell' | 'chime' | 'kalimba' | 'marimba' | 'singingBowl' | 'guitar' | 'piano' | 'flute' | 'xylophone' | 'ocean';
type ObstacleType = 'wall' | 'pillar' | 'corner' | 'tunnel' | 'maze' | 'none';

export default function SoundTrainer({ stats, setStats, currentMode }: SoundTrainerProps) {
    const [soundSource, setSoundSource] = useState<Point | null>(null);
    const [userGuess, setUserGuess] = useState<Point | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
    const [obstacleType, setObstacleType] = useState<ObstacleType>('none');
    const [soundType, setSoundType] = useState<SoundType>('kalimba');
    const [volume, setVolume] = useState(0.7);
    const [hasInteracted, setHasInteracted] = useState(false);
    const [threeSceneReady, setThreeSceneReady] = useState(false); // Новое состояние для готовности 3D сцены

    const audioContextRef = useRef<AudioContext | null>(null);
    const soundBuffersRef = useRef<Map<SoundType, AudioBuffer>>(new Map());
    const currentSourceRef = useRef<AudioBufferSourceNode | null>(null);

    const canvasSize = 400;
    const center = canvasSize / 2;
    const radius = 150;

    const soundDescriptions = {
        bell: { name: 'Колокольчик', emoji: '🔔', desc: 'Чистый и ясный' },
        chime: { name: 'Ветерок', emoji: '🎐', desc: 'Нежный и воздушный' },
        kalimba: { name: 'Калимба', emoji: '🎵', desc: 'Теплый и уютный' },
        marimba: { name: 'Маримба', emoji: '🎹', desc: 'Насыщенный и глубокий' },
        singingBowl: { name: 'Поющая чаша', emoji: '🪘', desc: 'Медитативный' },
        guitar: { name: 'Гитара', emoji: '🎸', desc: 'Мягкий и гармоничный' },
        piano: { name: 'Пианино', emoji: '🎹', desc: 'Классический и четкий' },
        flute: { name: 'Флейта', emoji: '🎶', desc: 'Легкий и воздушный' },
        xylophone: { name: 'Ксилофон', emoji: '🥁', desc: 'Яркий и ритмичный' },
        ocean: { name: 'Океан', emoji: '🌊', desc: 'Естественный и успокаивающий' }
    };

    const obstacleDescriptions = {
        none: { name: 'Без препятствий', emoji: '⚪', desc: 'Чистый звук' },
        wall: { name: 'Стена', emoji: '🧱', desc: 'Частичная блокировка' },
        pillar: { name: 'Колонна', emoji: '🪨', desc: 'Рассеивание звука' },
        corner: { name: 'Угол', emoji: '📐', desc: 'Отражения' },
        tunnel: { name: 'Тоннель', emoji: '🕳️', desc: 'Резонанс' },
        maze: { name: 'Лабиринт', emoji: '🌀', desc: 'Сложные отражения' }
    };

    useEffect(() => {
        const initAudioContext = async () => {
            if (!audioContextRef.current) {
                audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
            }

            const soundsToLoad: SoundType[] = Object.keys(soundDescriptions) as SoundType[];
            for (const type of soundsToLoad) {
                if (!soundBuffersRef.current.has(type)) {
                    const buffer = createFallbackSound(type);
                    soundBuffersRef.current.set(type, buffer);
                }
            }
        };

        initAudioContext();
    }, []);

    const stopCurrentSound = useCallback(() => {
        if (currentSourceRef.current) {
            try {
                currentSourceRef.current.stop();
            } catch (e) { }
            currentSourceRef.current = null;
        }
        setIsPlaying(false);
    }, []);

    const createFallbackSound = (type: SoundType): AudioBuffer => {
        if (!audioContextRef.current) throw new Error('AudioContext not initialized');

        const context = audioContextRef.current;
        const duration = type === 'ocean' ? 3 : 1.5;
        const sampleRate = context.sampleRate;
        const frameCount = sampleRate * duration;
        const buffer = context.createBuffer(2, frameCount, sampleRate);

        for (let channel = 0; channel < 2; channel++) {
            const data = buffer.getChannelData(channel);

            switch (type) {
                case 'bell':
                    for (let i = 0; i < frameCount; i++) {
                        const t = i / sampleRate;
                        const freq = 800 * Math.exp(-t * 2);
                        data[i] = Math.sin(2 * Math.PI * freq * t) * Math.exp(-t * 8) * 0.5;
                    }
                    break;
                case 'chime':
                    for (let i = 0; i < frameCount; i++) {
                        const t = i / sampleRate;
                        data[i] = (
                            Math.sin(2 * Math.PI * 440 * t) * 0.3 +
                            Math.sin(2 * Math.PI * 880 * t) * 0.2 +
                            Math.sin(2 * Math.PI * 1320 * t) * 0.1
                        ) * Math.exp(-t * 4) * 0.6;
                    }
                    break;
                case 'kalimba':
                    for (let i = 0; i < frameCount; i++) {
                        const t = i / sampleRate;
                        data[i] = Math.sin(2 * Math.PI * 392 * t) *
                            Math.exp(-t * 3) *
                            (1 + 0.3 * Math.sin(2 * Math.PI * 5 * t)) * 0.4;
                    }
                    break;
                case 'marimba':
                    for (let i = 0; i < frameCount; i++) {
                        const t = i / sampleRate;
                        data[i] = (
                            Math.sin(2 * Math.PI * 261 * t) * 0.4 +
                            Math.sin(2 * Math.PI * 523 * t) * 0.3 +
                            Math.sin(2 * Math.PI * 784 * t) * 0.2
                        ) * Math.exp(-t * 6) * 0.5;
                    }
                    break;
                case 'singingBowl':
                    for (let i = 0; i < frameCount; i++) {
                        const t = i / sampleRate;
                        data[i] = Math.sin(2 * Math.PI * 110 * t) *
                            Math.exp(-t * 1.5) *
                            (1 + 0.2 * Math.sin(2 * Math.PI * 3 * t)) * 0.3;
                    }
                    break;
                case 'guitar':
                    for (let i = 0; i < frameCount; i++) {
                        const t = i / sampleRate;
                        data[i] = (
                            Math.sin(2 * Math.PI * 196 * t) * 0.3 +
                            Math.sin(2 * Math.PI * 294 * t) * 0.2 +
                            Math.sin(2 * Math.PI * 392 * t) * 0.1
                        ) * Math.exp(-t * 4) * 0.5;
                    }
                    break;
                case 'piano':
                    for (let i = 0; i < frameCount; i++) {
                        const t = i / sampleRate;
                        data[i] = (
                            Math.sin(2 * Math.PI * 523 * t) * 0.4 +
                            Math.sin(2 * Math.PI * 659 * t) * 0.3 +
                            Math.sin(2 * Math.PI * 784 * t) * 0.2
                        ) * Math.exp(-t * 5) * 0.4;
                    }
                    break;
                case 'flute':
                    for (let i = 0; i < frameCount; i++) {
                        const t = i / sampleRate;
                        data[i] = Math.sin(2 * Math.PI * 880 * t) *
                            (1 + 0.1 * Math.sin(2 * Math.PI * 5 * t)) *
                            Math.exp(-t * 3) * 0.3;
                    }
                    break;
                case 'xylophone':
                    for (let i = 0; i < frameCount; i++) {
                        const t = i / sampleRate;
                        data[i] = (
                            Math.sin(2 * Math.PI * 1047 * t) * 0.3 +
                            Math.sin(2 * Math.PI * 1319 * t) * 0.2 +
                            Math.sin(2 * Math.PI * 1568 * t) * 0.1
                        ) * Math.exp(-t * 8) * 0.6;
                    }
                    break;
                case 'ocean':
                    for (let i = 0; i < frameCount; i++) {
                        const t = i / sampleRate;
                        data[i] = (
                            Math.sin(2 * Math.PI * 80 * t) * 0.1 +
                            Math.sin(2 * Math.PI * 160 * t) * 0.05 +
                            (Math.random() * 2 - 1) * 0.02
                        ) * (0.7 + 0.3 * Math.sin(2 * Math.PI * 0.2 * t)) * 0.4;
                    }
                    break;
            }
        }

        return buffer;
    };

    const playSound = useCallback(async (point: Point) => {
        try {
            stopCurrentSound();

            // Восстанавливаем аудиоконтекст если он был приостановлен
            if (audioContextRef.current?.state === 'suspended') {
                await audioContextRef.current.resume();
            }

            const buffer = soundBuffersRef.current.get(soundType);
            if (!buffer) {
                console.error('Sound buffer not found');
                return;
            }

            const source = audioContextRef.current!.createBufferSource();
            source.buffer = buffer;
            currentSourceRef.current = source;

            const panner = audioContextRef.current!.createStereoPanner();

            const normalizedX = (point.x - center) / radius;
            const pan = Math.max(-1, Math.min(1, normalizedX));
            panner.pan.value = pan;

            const gainNode = audioContextRef.current!.createGain();
            gainNode.gain.value = volume;

            source.connect(gainNode);
            gainNode.connect(panner);
            panner.connect(audioContextRef.current!.destination);

            if (obstacleType !== 'none') {
                const filter = audioContextRef.current!.createBiquadFilter();

                switch (obstacleType) {
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

                if (obstacleType !== 'maze') {
                    gainNode.disconnect();
                    gainNode.connect(filter);
                    filter.connect(panner);
                }
            }

            if (currentMode === '3d' && point.z !== undefined) {
                const distanceGain = audioContextRef.current!.createGain();
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

        } catch (error) {
            console.error('Error playing sound:', error);
            setIsPlaying(false);
        }
    }, [center, radius, soundType, volume, obstacleType, currentMode, stopCurrentSound]);

    const generateRandomPoint = useCallback((): Point => {
        const angle = Math.random() * 2 * Math.PI;
        const distance = difficulty === 'easy' ? radius * 0.7 :
            difficulty === 'medium' ? radius * 0.85 : radius;

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
    }, [center, radius, difficulty, currentMode]);

    const startNewRound = useCallback(() => {
        const newSource = generateRandomPoint();
        setSoundSource(newSource);
        setUserGuess(null);
        setShowResult(false);
        setHasInteracted(false);

        setTimeout(() => {
            playSound(newSource);
        }, 300);
    }, [generateRandomPoint, playSound]);

    const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
        if (isPlaying || (userGuess && hasInteracted) || !soundSource) return;

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
        if (isPlaying || (userGuess && hasInteracted) || !soundSource) return;
        handleGuess(point);
    };

    const handleGuess = (guessPoint: Point) => {
        setUserGuess(guessPoint);
        setShowResult(true);
        setHasInteracted(true);

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

        const threshold = difficulty === 'easy' ? 50 :
            difficulty === 'medium' ? 35 : 20;
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

    const drawObstacles = (ctx: CanvasRenderingContext2D) => {
        ctx.fillStyle = 'rgba(100, 100, 100, 0.7)';
        ctx.strokeStyle = 'rgba(150, 150, 150, 0.9)';
        ctx.lineWidth = 2;

        switch (obstacleType) {
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
    };

    useEffect(() => {
        if (currentMode !== '2d') return;

        const canvas = document.getElementById('soundCanvas') as HTMLCanvasElement;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Полная очистка канваса
        ctx.clearRect(0, 0, canvasSize, canvasSize);
        
        // Фон
        ctx.fillStyle = 'rgba(30, 41, 59, 0.8)';
        ctx.fillRect(0, 0, canvasSize, canvasSize);

        // Рисование целевой области
        ctx.strokeStyle = '#4ade80';
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.arc(center, center, radius, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.setLineDash([]);

        // Рисование препятствий
        if (obstacleType !== 'none') {
            drawObstacles(ctx);
        }

        // Рисование источника звука
        if (showResult && soundSource) {
            ctx.fillStyle = '#4ade80';
            ctx.beginPath();
            ctx.arc(soundSource.x, soundSource.y, 8, 0, 2 * Math.PI);
            ctx.fill();
        }

        // Рисование предположения пользователя
        if (userGuess) {
            ctx.fillStyle = showResult ? '#f87171' : '#60a5fa';
            ctx.beginPath();
            ctx.arc(userGuess.x, userGuess.y, 6, 0, 2 * Math.PI);
            ctx.fill();
        }

        // Рисование линий
        if (showResult && soundSource && userGuess) {
            ctx.strokeStyle = '#94a3b8';
            ctx.setLineDash([2, 2]);
            ctx.beginPath();
            ctx.moveTo(soundSource.x, soundSource.y);
            ctx.lineTo(userGuess.x, userGuess.y);
            ctx.stroke();
            ctx.setLineDash([]);
        }
    }, [soundSource, userGuess, showResult, center, radius, obstacleType, currentMode]);

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

    const handleThreeSceneReady = useCallback(() => {
        setThreeSceneReady(true);
    }, []);

    return (
        <div className="flex flex-col items-center space-y-6">
            <div className="bg-blue-800 rounded-lg p-4 w-full max-w-4xl">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Сложность</label>
                        <select
                            value={difficulty}
                            onChange={(e) => setDifficulty(e.target.value as 'easy' | 'medium' | 'hard')}
                            className="w-full bg-blue-700 border border-blue-600 rounded-md px-3 py-2 text-white text-sm"
                        >
                            <option value="easy">Легкая</option>
                            <option value="medium">Средняя</option>
                            <option value="hard">Сложная</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Тип звука</label>
                        <select
                            value={soundType}
                            onChange={(e) => setSoundType(e.target.value as SoundType)}
                            className="w-full bg-blue-700 border border-blue-600 rounded-md px-3 py-2 text-white text-sm"
                        >
                            {Object.entries(soundDescriptions).map(([key, { name, emoji }]) => (
                                <option key={key} value={key}>
                                    {emoji} {name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Препятствия</label>
                        <select
                            value={obstacleType}
                            onChange={(e) => setObstacleType(e.target.value as ObstacleType)}
                            className="w-full bg-blue-700 border border-blue-600 rounded-md px-3 py-2 text-white text-sm"
                        >
                            {Object.entries(obstacleDescriptions).map(([key, { name, emoji }]) => (
                                <option key={key} value={key}>
                                    {emoji} {name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex flex-col justify-end space-y-2">
                        <div className="text-xs text-blue-200">
                            Режим: <strong>{currentMode.toUpperCase()}</strong>
                        </div>
                        {currentMode === '3d' && !threeSceneReady && (
                            <div className="text-xs text-yellow-300">
                                Загрузка 3D сцены...
                            </div>
                        )}
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">
                        Громкость: {Math.round(volume * 100)}%
                    </label>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={volume}
                        onChange={(e) => setVolume(parseFloat(e.target.value))}
                        className="w-full h-2 bg-blue-700 rounded-lg appearance-none cursor-pointer"
                    />
                </div>

                <div className="text-center text-blue-200 text-sm mb-4 grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div>
                        {soundDescriptions[soundType].emoji} <strong>{soundDescriptions[soundType].name}</strong> - {soundDescriptions[soundType].desc}
                    </div>
                    <div>
                        {obstacleDescriptions[obstacleType].emoji} <strong>{obstacleDescriptions[obstacleType].name}</strong> - {obstacleDescriptions[obstacleType].desc}
                    </div>
                </div>

                <div className="flex space-x-4">
                    <button
                        onClick={startNewRound}
                        disabled={isPlaying}
                        className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-800 text-white font-semibold py-3 rounded-md transition-colors flex items-center justify-center space-x-2"
                    >
                        {isPlaying ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span>Звук воспроизводится...</span>
                            </>
                        ) : (
                            <>
                                <span>🎵</span>
                                <span>Новый звук</span>
                            </>
                        )}
                    </button>

                    {isPlaying && (
                        <button
                            onClick={stopSound}
                            className="px-6 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-md transition-colors"
                        >
                            ⏹️ Стоп
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
                        className={`border-2 border-blue-600 rounded-lg bg-slate-800 transition-all hover:border-blue-500 ${
                            (isPlaying || (userGuess && hasInteracted) || !soundSource) 
                                ? 'cursor-not-allowed opacity-70' 
                                : 'cursor-crosshair'
                        }`}
                        style={{ width: canvasSize, height: canvasSize }}
                    />

                    {showResult && soundSource && userGuess && (
                        <div className="absolute top-4 left-4 bg-black bg-opacity-70 p-3 rounded-lg">
                            <div className="text-sm">
                                Расстояние: {calculateDistanceInMeters(userGuess, soundSource).toFixed(2)}м
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <ThreeScene
                    obstacleType={obstacleType}
                    onPointSelect={handle3DPointSelect}
                    soundSource={showResult ? soundSource : null}
                    userGuess={userGuess}
                    hasInteracted={hasInteracted}
                    showResult={showResult}
                />
            )}

            <div className="text-center text-blue-200 max-w-md">
                <p>
                    {currentMode === '3d'
                        ? threeSceneReady 
                            ? 'Кликните в 3D пространстве чтобы указать источник звука'
                            : 'Загрузка 3D сцены...'
                        : 'Кликните на круге в том месте, откуда, по вашему мнению, исходит звук'
                    }
                </p>
                {obstacleType !== 'none' && (
                    <p className="text-yellow-300 mt-2">
                        ⚠️ Препятствия влияют на звук - слушайте внимательно!
                    </p>
                )}
                {(userGuess && hasInteracted) && (
                    <p className="text-yellow-300 mt-2">
                        ⚠️ Вы уже сделали предположение в этом раунде
                    </p>
                )}
            </div>
        </div>
    );
}