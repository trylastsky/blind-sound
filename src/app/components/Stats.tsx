'use client';
import { StatsData } from '../page';
import { useEffect, useRef } from 'react';
import { Target, TrendingUp, Award, Zap, BarChart3, Crown } from 'lucide-react';

interface StatsProps {
  stats: StatsData;
  currentMode: '2d' | '3d';
}

export default function Stats({ stats, currentMode }: StatsProps) {
  const modeStats = stats.modeStats[currentMode];
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.4;

    ctx.clearRect(0, 0, width, height);

    const correct = stats.correctAttempts;
    const incorrect = stats.totalAttempts - correct;

    if (stats.totalAttempts === 0) {
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      ctx.fillStyle = 'rgba(59, 130, 246, 0.3)';
      ctx.fill();

      ctx.fillStyle = '#93c5fd';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('Нет данных', centerX, centerY);
      return;
    }

    const correctPercentage = (correct / stats.totalAttempts) * 100;
    const incorrectPercentage = (incorrect / stats.totalAttempts) * 100;

    const correctColor = '#4ade80';
    const incorrectColor = '#f87171';

    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, 0, (correctPercentage / 100) * 2 * Math.PI);
    ctx.closePath();
    ctx.fillStyle = correctColor;
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius,
      (correctPercentage / 100) * 2 * Math.PI,
      2 * Math.PI);
    ctx.closePath();
    ctx.fillStyle = incorrectColor;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.6, 0, 2 * Math.PI);
    ctx.fillStyle = '#1e293b';
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${totalAccuracy.toFixed(1)}%`, centerX, centerY);

    ctx.font = '12px Arial';
    ctx.fillStyle = '#93c5fd';
    ctx.fillText('Общая точность', centerX, centerY + 25);

    const legendX = centerX;
    const legendY = centerY + radius + 30;
    const legendItemHeight = 20;
    const legendSquareSize = 12;

    ctx.fillStyle = correctColor;
    ctx.fillRect(legendX - 40, legendY, legendSquareSize, legendSquareSize);
    ctx.fillStyle = '#ffffff';
    ctx.font = '12px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Правильные: ${correct} (${correctPercentage.toFixed(1)}%)`,
      legendX - 20, legendY + 10);

    ctx.fillStyle = incorrectColor;
    ctx.fillRect(legendX - 40, legendY + legendItemHeight, legendSquareSize, legendSquareSize);
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`Неправильные: ${incorrect} (${incorrectPercentage.toFixed(1)}%)`,
      legendX - 20, legendY + legendItemHeight + 10);

  }, [stats, totalAccuracy]);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-blue-800 rounded-xl p-6">
        <h2 className="text-3xl font-bold text-center mb-6 flex items-center justify-center gap-3">
          <BarChart3 className="w-8 h-8" />
          Статистика - Режим {currentMode.toUpperCase()}
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-700 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-400 flex items-center justify-center gap-2">
              <Target className="w-5 h-5" />
              {modeStats.totalAttempts}
            </div>
            <div className="text-blue-200">Всего попыток</div>
          </div>

          <div className="bg-blue-700 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-blue-400 flex items-center justify-center gap-2">
              <TrendingUp className="w-5 h-5" />
              {accuracy.toFixed(1)}%
            </div>
            <div className="text-blue-200">Точность</div>
          </div>

          <div className="bg-blue-700 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-yellow-400 flex items-center justify-center gap-2">
              <Zap className="w-5 h-5" />
              {modeStats.currentStreak}
            </div>
            <div className="text-blue-200">Текущая серия</div>
          </div>

          <div className="bg-blue-700 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-red-400 flex items-center justify-center gap-2">
              <Crown className="w-5 h-5" />
              {modeStats.bestStreak}
            </div>
            <div className="text-blue-200">Лучшая серия</div>
          </div>
        </div>

        <div className="bg-blue-900 rounded-lg p-6 mb-6">
          <h3 className="text-xl font-semibold mb-4 text-center flex items-center justify-center gap-2">
            <Award className="w-5 h-5" />
            Уровень мастерства
          </h3>
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

      <div className="bg-blue-800 rounded-xl p-6">
        <h3 className="text-2xl font-bold text-center mb-6">Общая статистика точности</h3>

        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex-1">
            <canvas
              ref={canvasRef}
              width={400}
              height={300}
              className="w-full max-w-md mx-auto"
            />
          </div>

          <div className="flex-1 bg-blue-700 p-6 rounded-lg">
            <h4 className="text-lg font-semibold mb-4 text-center">Сводка по всем режимам</h4>

            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-blue-600 rounded">
                <span className="text-blue-200">Всего попыток:</span>
                <span className="text-white font-bold text-lg">{stats.totalAttempts}</span>
              </div>

              <div className="flex justify-between items-center p-3 bg-blue-600 rounded">
                <span className="text-blue-200">Правильные ответы:</span>
                <span className="text-green-400 font-bold text-lg">{stats.correctAttempts}</span>
              </div>

              <div className="flex justify-between items-center p-3 bg-blue-600 rounded">
                <span className="text-blue-200">Неправильные ответы:</span>
                <span className="text-red-400 font-bold text-lg">
                  {stats.totalAttempts - stats.correctAttempts}
                </span>
              </div>

              <div className="flex justify-between items-center p-3 bg-blue-600 rounded">
                <span className="text-blue-200">Общая точность:</span>
                <span className="text-yellow-400 font-bold text-lg">{totalAccuracy.toFixed(1)}%</span>
              </div>

              <div className="flex justify-between items-center p-3 bg-blue-600 rounded">
                <span className="text-blue-200">Текущая серия:</span>
                <span className="text-purple-400 font-bold text-lg">{stats.currentStreak}</span>
              </div>

              <div className="flex justify-between items-center p-3 bg-blue-600 rounded">
                <span className="text-blue-200">Лучшая серия:</span>
                <span className="text-pink-400 font-bold text-lg">{stats.bestStreak}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

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
      </div>

      <div className="text-center text-blue-200">
        <p>Статистика сохраняется автоматически. Продолжайте тренировки для улучшения результатов!</p>
      </div>
    </div>
  );
}