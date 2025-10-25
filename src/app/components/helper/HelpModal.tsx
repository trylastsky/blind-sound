'use client';
import { useState } from 'react';
import { get3DInstructions, getInstructions, obstacles, soundTypes } from './instructions';

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

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all z-50 cursor-pointer"
        title="Помощь"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-blue-800 rounded-xl max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-blue-800 p-6 border-b border-blue-700 flex justify-between items-center">
              <h2 className="text-2xl font-bold">
                Помощь - Режим {currentMode.toUpperCase()}
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-blue-200 hover:text-white p-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  {instructions.slice(0, 2).map((section, index) => (
                    <div key={index} className="bg-blue-700 p-4 rounded-lg">
                      <h3 className={`text-lg font-semibold mb-2 ${section.color}`}>
                        {section.title}
                      </h3>
                      {renderContent(section.content)}
                    </div>
                  ))}

                  <div className="bg-blue-700 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2 text-purple-400">
                      🎵 Типы звуков
                    </h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {Object.entries(soundTypes).map(([key, { emoji, name }]) => (
                        <div key={key} className="flex items-center space-x-1">
                          <span>{emoji}</span>
                          <span>{name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {instructions.slice(2).map((section, index) => (
                    <div key={index} className="bg-blue-700 p-4 rounded-lg">
                      <h3 className={`text-lg font-semibold mb-2 ${section.color}`}>
                        {section.title}
                      </h3>
                      {renderContent(section.content)}
                    </div>
                  ))}

                  <div className="bg-blue-700 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2 text-red-400">
                      🧱 Препятствия
                    </h3>
                    <div className="space-y-2 text-sm">
                      {Object.entries(obstacles).map(([key, { emoji, name, description }]) => (
                        <div key={key} className="flex items-center space-x-2">
                          <span>{emoji}</span>
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
                <h3 className="text-lg font-semibold mb-3 text-center">
                  🎧 Советы для эффективной тренировки
                </h3>
                <div className="grid md:grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-xl mb-2">🎛️</div>
                    <p className="text-sm">Используйте стерео наушники</p>
                  </div>
                  <div>
                    <div className="text-xl mb-2">🔊</div>
                    <p className="text-sm">Установите комфортную громкость</p>
                  </div>
                  <div>
                    <div className="text-xl mb-2">🌙</div>
                    <p className="text-sm">Занимайтесь в тихой обстановке</p>
                  </div>
                </div>
              </div>

              {threeDInstructions && (
                <div className="bg-purple-800 p-4 rounded-lg">
                  <h3 className={`text-lg font-semibold mb-3 text-center ${threeDInstructions.color}`}>
                    {threeDInstructions.title}
                  </h3>
                  <div className="text-center">
                    <p className="mb-3 text-sm">{threeDInstructions.content}</p>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="text-lg">👆</div>
                        <p>
                          <strong>Спереди</strong> {"(Z > 0)"}
                        </p>
                      </div>
                      <div>
                        <div className="text-lg">🔄</div>
                        <p>
                          <strong>На одном уровне</strong> (Z ≈ 0)
                        </p>
                      </div>
                      <div>
                        <div className="text-lg">👇</div>
                        <p>
                          <strong>Сзади</strong> {"(Z < 0)"}
                        </p>
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