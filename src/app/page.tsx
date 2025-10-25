'use client';
import { useState, useEffect } from 'react';
import SoundTrainer from './components/SoundTrainer';
import Stats from './components/Stats';
import HelpModal from './components/helper/HelpModal';
import { Headphones, Gamepad2, ChartArea, Axis3D } from 'lucide-react';

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

  useEffect(() => {
    const savedStats = localStorage.getItem('soundTrainerStats');
    const savedView = localStorage.getItem('soundTrainerView');
    const savedMode = localStorage.getItem('soundTrainerMode');

    if (savedStats) {
      try {
        setStats(JSON.parse(savedStats));
      } catch (e) {
        console.error('Error loading stats from localStorage:', e);
      }
    }

    if (savedView) {
      setCurrentView(savedView as 'instructions' | 'trainer' | 'stats');
    }

    if (savedMode) {
      setCurrentMode(savedMode as '2d' | '3d');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('soundTrainerStats', JSON.stringify(stats));
  }, [stats]);

  useEffect(() => {
    localStorage.setItem('soundTrainerView', currentView);
  }, [currentView]);

  useEffect(() => {
    localStorage.setItem('soundTrainerMode', currentMode);
  }, [currentMode]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center justify-center gap-3">
            Blind Sound
          </h1>
          <p className="text-xl text-blue-200 flex items-center justify-center gap-2">
            <Headphones className="w-5 h-5" />
            Развивайте пространственный слух
          </p>
        </header>

        <nav className="flex justify-center mb-8">
          <div className="bg-blue-800 rounded-lg p-1 flex flex-wrap justify-center gap-2">
            <button
              onClick={() => setCurrentView('trainer')}
              className={`px-4 py-2 rounded-md cursor-pointer transition-colors flex items-center gap-2 ${currentView === 'trainer' ? 'bg-blue-600 text-white' : 'text-blue-200'
                }`}
            >
              <Gamepad2 className="w-4 h-4" />
              Тренажер
            </button>
            <button
              onClick={() => setCurrentView('stats')}
              className={`px-4 py-2 rounded-md cursor-pointer transition-colors flex items-center gap-2 ${currentView === 'stats' ? 'bg-blue-600 text-white' : 'text-blue-200'
                }`}
            >
              <ChartArea className="w-4 h-4" />
              Статистика
            </button>

            <div className="flex items-center space-x-2 ml-4">
              <span className="text-blue-200 flex items-center gap-1">
                <Axis3D className="w-4 h-4" />
                Режим:
              </span>
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
        {currentView === 'trainer' && (
          <SoundTrainer
            stats={stats}
            setStats={setStats}
            currentMode={currentMode}
          />
        )}
        {currentView === 'stats' && <Stats stats={stats} currentMode={currentMode} />}

        <HelpModal currentMode={currentMode} />
      </div>
    </main>
  );
}