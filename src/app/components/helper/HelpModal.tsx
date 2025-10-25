'use client';
import { useState } from 'react';
import { get3DInstructions, getInstructions, obstacles, soundTypes } from './instructions';
import {
    HelpCircle,
    X,
    Volume2,
    ArrowDown,
    RefreshCw,
    ArrowUp,
    BookOpenText,
    AudioLines,
    Headphones,
    ToyBrick,
    Target
} from 'lucide-react';

interface HelpModalProps {
    currentMode: "2d" | "3d";
}

export default function HelpModal({ currentMode }: HelpModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const instructions = getInstructions(currentMode);
    const threeDInstructions = currentMode === "3d" ? get3DInstructions() : null;

    const renderContent = (content: string | string[]) => {
        if (Array.isArray(content)) {
            return (
                <ul className="list-disc list-inside space-y-2">
                    {content.map((item, index) => (
                        <li key={index} className="text-blue-100">{item}</li>
                    ))}
                </ul>
            );
        }
        return <p className="text-blue-100">{content}</p>;
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white p-4 rounded-full shadow-2xl transition-all z-50 cursor-pointer group border-2 border-purple-400/30"
                title="Помощь и инструкции"
            >
                <HelpCircle className="w-7 h-7 group-hover:scale-110 transition-transform" />
            </button>

            {isOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
                    <div className="bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 rounded-2xl max-w-5xl max-h-[95vh] overflow-y-auto border-2 border-purple-500/30 shadow-2xl">
                        <div className="sticky top-0 bg-gradient-to-r from-blue-900/90 to-purple-900/90 p-6 border-b border-purple-500/30 flex justify-between items-center backdrop-blur-sm">
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg">
                                    <BookOpenText className="w-7 h-7 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                                        Помощь - Режим {currentMode.toUpperCase()}
                                    </h2>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-blue-300 hover:text-white p-3 rounded-xl hover:bg-purple-700/50 transition-all cursor-pointer border border-purple-500/30"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-8 space-y-8">
                            <div className="grid lg:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    {instructions.slice(0, 2).map((section, index) => (
                                        <div key={index} className="bg-gradient-to-br from-blue-800/50 to-purple-800/50 p-6 rounded-xl border border-purple-500/20 hover:border-purple-500/40 transition-all">
                                            <h3 className={`text-xl font-bold mb-4 ${section.color} flex items-center gap-3`}>
                                                <div className="p-2 bg-white/10 rounded-lg">
                                                    {section.icon}
                                                </div>
                                                {section.title}
                                            </h3>
                                            <div className="text-blue-100/90 leading-relaxed">
                                                {renderContent(section.content)}
                                            </div>
                                        </div>
                                    ))}

                                    {/* Sound Types */}
                                    <div className="bg-gradient-to-br from-blue-800/50 to-purple-800/50 p-6 rounded-xl border border-purple-500/20">
                                        <h3 className="text-xl font-bold mb-4 text-purple-300 flex items-center gap-3">
                                            <div className="p-2 bg-purple-500/20 rounded-lg">
                                                {soundTypes.bell.icon}
                                            </div>
                                            Типы звуков
                                        </h3>
                                        <div className="grid grid-cols-2 gap-3">
                                            {Object.entries(soundTypes).map(([key, sound]) => (
                                                <div key={key} className="flex items-center space-x-3 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                                                    <div className="text-purple-300">
                                                        {sound.icon}
                                                    </div>
                                                    <span className="text-blue-100 text-sm font-medium">{sound.name}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column */}
                                <div className="space-y-6">
                                    {instructions.slice(2).map((section, index) => (
                                        <div key={index} className="bg-gradient-to-br from-blue-800/50 to-purple-800/50 p-6 rounded-xl border border-purple-500/20 hover:border-purple-500/40 transition-all">
                                            <h3 className={`text-xl font-bold mb-4 ${section.color} flex items-center gap-3`}>
                                                <div className="p-2 bg-white/10 rounded-lg">
                                                    {section.icon}
                                                </div>
                                                {section.title}
                                            </h3>
                                            <div className="text-blue-100/90 leading-relaxed">
                                                {renderContent(section.content)}
                                            </div>
                                        </div>
                                    ))}

                                    {/* Obstacles */}
                                    <div className="bg-gradient-to-br from-blue-800/50 to-purple-800/50 p-6 rounded-xl border border-purple-500/20">
                                        <h3 className="text-xl font-bold mb-4 text-red-300 flex items-center gap-3">
                                            <div className="p-2 bg-red-500/20 rounded-lg">
                                                <ToyBrick className='w-5 h-5' />
                                            </div>
                                            Препятствия
                                        </h3>
                                        <div className="space-y-3">
                                            {Object.entries(obstacles).map(([key, obstacle]) => (
                                                <div key={key} className="flex items-center space-x-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                                                    <div className="text-red-300">
                                                        {obstacle.icon}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="font-semibold text-blue-100">{obstacle.name}</div>
                                                        <div className="text-sm text-blue-300">{obstacle.description}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Training Tips */}
                            <div className="bg-gradient-to-r from-purple-800/50 to-blue-800/50 p-6 rounded-2xl border border-purple-500/30">
                                <h3 className="text-xl font-bold mb-6 text-center text-white flex items-center justify-center gap-3">
                                    <Target className="w-6 h-6 text-green-400" />
                                    Советы для эффективной тренировки
                                </h3>
                                <div className="grid md:grid-cols-3 gap-6">
                                    <div className="text-center p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all">
                                        <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-500/20 rounded-full mb-3">
                                            <Volume2 className="w-6 h-6 text-blue-300" />
                                        </div>
                                        <h4 className="font-semibold text-white mb-2">Используйте стерео наушники</h4>
                                        <p className="text-blue-200 text-sm">Для лучшего восприятия пространственного звука</p>
                                    </div>
                                    <div className="text-center p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all">
                                        <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-500/20 rounded-full mb-3">
                                            <AudioLines className="w-6 h-6 text-purple-300" />
                                        </div>
                                        <h4 className="font-semibold text-white mb-2">Комфортная громкость</h4>
                                        <p className="text-blue-200 text-sm">Настройте громкость для оптимального восприятия</p>
                                    </div>
                                    <div className="text-center p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all">
                                        <div className="inline-flex items-center justify-center w-12 h-12 bg-green-500/20 rounded-full mb-3">
                                            <Headphones className="w-6 h-6 text-green-300" />
                                        </div>
                                        <h4 className="font-semibold text-white mb-2">Тихая обстановка</h4>
                                        <p className="text-blue-200 text-sm">Занимайтесь в спокойной атмосфере</p>
                                    </div>
                                </div>
                            </div>

                            {threeDInstructions && (
                                <div className="bg-gradient-to-r from-purple-700/40 to-blue-700/40 p-6 rounded-2xl border border-purple-500/30">
                                    <h3 className={`text-xl font-bold mb-6 text-center ${threeDInstructions.color} flex items-center justify-center gap-3`}>
                                        <div className="p-2 bg-white/10 rounded-lg">
                                            {threeDInstructions.icon}
                                        </div>
                                        {threeDInstructions.title}
                                    </h3>
                                    <div className="text-center">
                                        <p className="mb-6 text-blue-100 text-lg">{threeDInstructions.content}</p>
                                        <div className="grid grid-cols-3 gap-6">
                                            <div className="text-center p-4 rounded-xl bg-white/5">
                                                <div className="inline-flex items-center justify-center w-12 h-12 bg-green-500/20 rounded-full mb-3">
                                                    <ArrowUp className="w-6 h-6 text-green-400" />
                                                </div>
                                                <p className="font-semibold text-white">Спереди</p>
                                                <p className="text-blue-300 text-sm">{"(Z > 0)"}</p>
                                            </div>
                                            <div className="text-center p-4 rounded-xl bg-white/5">
                                                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-500/20 rounded-full mb-3">
                                                    <RefreshCw className="w-6 h-6 text-blue-400" />
                                                </div>
                                                <p className="font-semibold text-white">На одном уровне</p>
                                                <p className="text-blue-300 text-sm">(Z ≈ 0)</p>
                                            </div>
                                            <div className="text-center p-4 rounded-xl bg-white/5">
                                                <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-500/20 rounded-full mb-3">
                                                    <ArrowDown className="w-6 h-6 text-purple-400" />
                                                </div>
                                                <p className="font-semibold text-white">Сзади</p>
                                                <p className="text-blue-300 text-sm">{"(Z < 0)"}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
        </>
    );
}