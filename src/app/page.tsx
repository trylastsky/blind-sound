'use client';
import { useState, useEffect, useRef } from 'react';
import SoundTrainer from './components/SoundTrainer';
import Instructions from './components/Instructions';
import Stats from './components/Stats';

export interface StatsData {
  totalAttempts: number;
  correctAttempts: number;
  currentStreak: number;
  bestStreak: number;
  modeStats: {
    '2d': StatsData;
    '3d': StatsData;
  };
}

const initialStats: StatsData = {
  totalAttempts: 0,
  correctAttempts: 0,
  currentStreak: 0,
  bestStreak: 0,
  modeStats: {
    '2d': { totalAttempts: 0, correctAttempts: 0, currentStreak: 0, bestStreak: 0, modeStats: {} as any },
    '3d': { totalAttempts: 0, correctAttempts: 0, currentStreak: 0, bestStreak: 0, modeStats: {} as any }
  }
};

export default function Home() {
  const [currentView, setCurrentView] = useState<'instructions' | 'trainer' | 'stats'>('instructions');
  const [stats, setStats] = useState<StatsData>(initialStats);
  const [currentMode, setCurrentMode] = useState<'2d' | '3d'>('2d');

  // Загрузка статистики из localStorage
  useEffect(() => {
    const savedStats = localStorage.getItem('soundTrainerStats');
    if (savedStats) {
      try {
        setStats(JSON.parse(savedStats));
      } catch (e) {
        console.error('Error loading stats from localStorage:', e);
      }
    }
  }, []);

  // Сохранение статистики в localStorage
  useEffect(() => {
    localStorage.setItem('soundTrainerStats', JSON.stringify(stats));
  }, [stats]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Blind Sound</h1>
          <p className="text-xl text-blue-200">Развивайте пространственный слух в 2D и 3D режимах</p>
        </header>

        <nav className="flex justify-center mb-8">
          <div className="bg-blue-800 rounded-lg p-1 flex flex-wrap justify-center gap-2">
            <button
              onClick={() => setCurrentView('instructions')}
              className={`px-4 py-2 rounded-md transition-colors ${
                currentView === 'instructions' ? 'bg-blue-600 text-white' : 'text-blue-200'
              }`}
            >
              Инструкция
            </button>
            <button
              onClick={() => setCurrentView('trainer')}
              className={`px-4 py-2 rounded-md transition-colors ${
                currentView === 'trainer' ? 'bg-blue-600 text-white' : 'text-blue-200'
              }`}
            >
              Тренажер
            </button>
            <button
              onClick={() => setCurrentView('stats')}
              className={`px-4 py-2 rounded-md transition-colors ${
                currentView === 'stats' ? 'bg-blue-600 text-white' : 'text-blue-200'
              }`}
            >
              Статистика
            </button>
            
            <div className="flex items-center space-x-2 ml-4">
              <span className="text-blue-200">Режим:</span>
              <select 
                value={currentMode}
                onChange={(e) => setCurrentMode(e.target.value as '2d' | '3d')}
                className="bg-blue-700 border border-blue-600 rounded-md px-3 py-1 text-white text-sm"
              >
                <option value="2d">2D</option>
                <option value="3d">3D</option>
              </select>
            </div>
          </div>
        </nav>

        {currentView === 'instructions' && <Instructions currentMode={currentMode} />}
        {currentView === 'trainer' && (
          <SoundTrainer 
            stats={stats} 
            setStats={setStats} 
            currentMode={currentMode}
          />
        )}
        {currentView === 'stats' && <Stats stats={stats} currentMode={currentMode} />}
      </div>
    </main>
  );
}