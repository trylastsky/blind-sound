import { StatsData } from '../page';

interface StatsProps {
  stats: StatsData;
  currentMode: '2d' | '3d';
}

export default function Stats({ stats, currentMode }: StatsProps) {
  const modeStats = stats.modeStats[currentMode];
  
  const accuracy = modeStats.totalAttempts > 0 
    ? (modeStats.correctAttempts / modeStats.totalAttempts) * 100 
    : 0;

  const totalAccuracy = stats.totalAttempts > 0 
    ? (stats.correctAttempts / stats.totalAttempts) * 100 
    : 0;

  const getLevel = (acc: number) => {
    if (acc >= 85) return { name: 'Эксперт', color: 'text-red-400', bg: 'bg-red-500' };
    if (acc >= 60) return { name: 'Опытный', color: 'text-yellow-400', bg: 'bg-yellow-500' };
    if (acc >= 30) return { name: 'Новичок', color: 'text-green-400', bg: 'bg-green-500' };
    return { name: 'Начинающий', color: 'text-blue-400', bg: 'bg-blue-500' };
  };

  const currentLevel = getLevel(accuracy);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-blue-800 rounded-xl p-6">
        <h2 className="text-3xl font-bold text-center mb-6">
          Статистика - Режим {currentMode.toUpperCase()}
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-700 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-400">{modeStats.totalAttempts}</div>
            <div className="text-blue-200">Всего попыток</div>
          </div>
          
          <div className="bg-blue-700 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-blue-400">{accuracy.toFixed(1)}%</div>
            <div className="text-blue-200">Точность</div>
          </div>
          
          <div className="bg-blue-700 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-yellow-400">{modeStats.currentStreak}</div>
            <div className="text-blue-200">Текущая серия</div>
          </div>
          
          <div className="bg-blue-700 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-red-400">{modeStats.bestStreak}</div>
            <div className="text-blue-200">Лучшая серия</div>
          </div>
        </div>

        <div className="bg-blue-900 rounded-lg p-6 mb-6">
          <h3 className="text-xl font-semibold mb-4 text-center">📈 Уровень мастерства</h3>
          <div className="text-center mb-4">
            <span className={`text-2xl font-bold ${currentLevel.color}`}>
              {currentLevel.name}
            </span>
            <div className="text-blue-200 mt-1">Точность: {accuracy.toFixed(1)}%</div>
          </div>
          
          <div className="w-full bg-blue-700 rounded-full h-4 mb-2">
            <div 
              className={`h-4 rounded-full transition-all duration-500 ${currentLevel.bg}`}
              style={{ width: `${Math.min(100, accuracy)}%` }}
            ></div>
          </div>
          
          <div className="flex justify-between text-sm text-blue-200">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>
      </div>

      {/* Сравнение режимов */}
      <div className="bg-blue-800 rounded-xl p-6">
        <h3 className="text-2xl font-bold text-center mb-4">Сравнение режимов</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-700 p-4 rounded-lg">
            <h4 className="text-lg font-semibold mb-3 text-green-400">2D Режим</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Попытки:</span>
                <span className="font-bold">{stats.modeStats['2d'].totalAttempts}</span>
              </div>
              <div className="flex justify-between">
                <span>Точность:</span>
                <span className="font-bold">
                  {stats.modeStats['2d'].totalAttempts > 0 
                    ? ((stats.modeStats['2d'].correctAttempts / stats.modeStats['2d'].totalAttempts) * 100).toFixed(1)
                    : '0'}%
                </span>
              </div>
              <div className="flex justify-between">
                <span>Лучшая серия:</span>
                <span className="font-bold">{stats.modeStats['2d'].bestStreak}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-700 p-4 rounded-lg">
            <h4 className="text-lg font-semibold mb-3 text-purple-400">3D Режим</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Попытки:</span>
                <span className="font-bold">{stats.modeStats['3d'].totalAttempts}</span>
              </div>
              <div className="flex justify-between">
                <span>Точность:</span>
                <span className="font-bold">
                  {stats.modeStats['3d'].totalAttempts > 0 
                    ? ((stats.modeStats['3d'].correctAttempts / stats.modeStats['3d'].totalAttempts) * 100).toFixed(1)
                    : '0'}%
                </span>
              </div>
              <div className="flex justify-between">
                <span>Лучшая серия:</span>
                <span className="font-bold">{stats.modeStats['3d'].bestStreak}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <div className="bg-blue-900 p-4 rounded-lg">
            <h4 className="text-lg font-semibold mb-2">Общая статистика</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="text-2xl font-bold text-blue-400">{stats.totalAttempts}</div>
                <div className="text-blue-200 text-sm">Всего попыток</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-400">{totalAccuracy.toFixed(1)}%</div>
                <div className="text-blue-200 text-sm">Общая точность</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-400">{stats.currentStreak}</div>
                <div className="text-blue-200 text-sm">Текущая серия</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-400">{stats.bestStreak}</div>
                <div className="text-blue-200 text-sm">Лучшая серия</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center text-blue-200">
        <p>Статистика сохраняется автоматически. Продолжайте тренировки для улучшения результатов!</p>
      </div>
    </div>
  );
}