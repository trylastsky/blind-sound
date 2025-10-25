'use client';
import { JSX, useState } from 'react';
import { get3DInstructions, getInstructions, obstacles, soundTypes } from './instructions';
import { 
  HelpCircle, 
  X, 
  Target, 
  Ear, 
  Gamepad2, 
  Headphones,
  Volume2,
  ArrowDown,
  RefreshCw,
  ArrowUp,
  Globe,
  Square,
  Music,
  Moon,
  AudioLines,
  BookOpenText
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
        <ul className="list-disc list-inside space-y-1">
          {content.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      );
    }
    return <p>{content}</p>;
  };

  const getIcon = (iconName: string) => {
    const icons: { [key: string]: JSX.Element } = {
      '🎯': <Target className="w-5 h-5" />,
      '👂': <Ear className="w-5 h-5" />,
      '🎮': <Gamepad2 className="w-5 h-5" />,
      '🎧': <Headphones className="w-5 h-5" />,
      '🌐': <Globe className="w-5 h-5" />,
      '🎵': <Music className="w-5 h-5" />,
      '🧱': <Square className="w-5 h-5" />,
      '🎛️': <Volume2 className="w-5 h-5" />,
      '🔊': <Volume2 className="w-5 h-5" />,
      '🌙': <Moon className="w-5 h-5" />,
      '👆': <ArrowUp className="w-5 h-5" />,
      '🔄': <RefreshCw className="w-5 h-5" />,
      '👇': <ArrowDown className="w-5 h-5" />
    };
    return icons[iconName] || <HelpCircle className="w-5 h-5" />;
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all z-50 cursor-pointer"
        title="Помощь"
      >
        <HelpCircle className="w-6 h-6" />
      </button>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-blue-800 rounded-xl max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-blue-800 p-6 border-b border-blue-700 flex justify-between items-center">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <HelpCircle className="w-6 h-6" />
                Помощь - Режим {currentMode.toUpperCase()}
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-blue-200 hover:text-white p-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  {instructions.slice(0, 2).map((section, index) => (
                    <div key={index} className="bg-blue-700 p-4 rounded-lg">
                      <h3 className={`text-lg font-semibold mb-2 ${section.color} flex items-center gap-2`}>
                        {getIcon(section.icon)}
                        {section.title}
                      </h3>
                      {renderContent(section.content)}
                    </div>
                  ))}

                  <div className="bg-blue-700 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2 text-purple-400 flex items-center gap-2">
                      <Music className="w-5 h-5" />
                      Типы звуков
                    </h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {Object.entries(soundTypes).map(([key, { name }]) => (
                        <div key={key} className="flex items-center space-x-2">
                          <Music className="w-4 h-4" />
                          <span>{name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {instructions.slice(2).map((section, index) => (
                    <div key={index} className="bg-blue-700 p-4 rounded-lg">
                      <h3 className={`text-lg font-semibold mb-2 ${section.color} flex items-center gap-2`}>
                        {getIcon(section.icon)}
                        {section.title}
                      </h3>
                      {renderContent(section.content)}
                    </div>
                  ))}

                  <div className="bg-blue-700 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2 text-red-400 flex items-center gap-2">
                      <Square className="w-5 h-5" />
                      Препятствия
                    </h3>
                    <div className="space-y-2 text-sm">
                      {Object.entries(obstacles).map(([key, { name, description }]) => (
                        <div key={key} className="flex items-center space-x-2">
                          <Square className="w-4 h-4" />
                          <span>
                            <strong>{name}</strong> - {description}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-900 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-3 text-center flex items-center justify-center gap-2">
                  <BookOpenText className="w-5 h-5" />
                  Советы для эффективной тренировки
                </h3>
                <div className="grid md:grid-cols-3 gap-4 text-center">
                  <div className="flex flex-col items-center">
                    <Volume2 className="w-6 h-6 mb-2" />
                    <p className="text-sm">Используйте стерео наушники</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <AudioLines className="w-6 h-6 mb-2" />
                    <p className="text-sm">Установите комфортную громкость</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <Headphones className="w-6 h-6 mb-2" />
                    <p className="text-sm">Занимайтесь в тихой обстановке</p>
                  </div>
                </div>
              </div>

              {threeDInstructions && (
                <div className="bg-purple-800 p-4 rounded-lg">
                  <h3 className={`text-lg font-semibold mb-3 text-center ${threeDInstructions.color} flex items-center justify-center gap-2`}>
                    <Globe className="w-5 h-5" />
                    {threeDInstructions.title}
                  </h3>
                  <div className="text-center">
                    <p className="mb-3 text-sm">{threeDInstructions.content}</p>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="flex flex-col items-center">
                        <ArrowUp className="w-5 h-5 mb-1" />
                        <p><strong>Спереди</strong> {"(Z > 0)"}</p>
                      </div>
                      <div className="flex flex-col items-center">
                        <RefreshCw className="w-5 h-5 mb-1" />
                        <p><strong>На одном уровне</strong> (Z ≈ 0)</p>
                      </div>
                      <div className="flex flex-col items-center">
                        <ArrowDown className="w-5 h-5 mb-1" />
                        <p><strong>Сзади</strong> {"(Z < 0)"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}