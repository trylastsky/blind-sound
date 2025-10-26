'use client';
import { StatsData } from '../page';
import { useEffect, useRef } from 'react';
import {
	Target,
	TrendingUp,
	Award,
	Zap,
	BarChart3,
	Crown,
	Rocket,
	Star,
	Trophy,
	TrendingDown,
	Users,
	Activity,
	ChartPie
} from 'lucide-react';

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
		if (acc >= 85) return {
			name: 'Мастер Эхолокации',
			color: 'text-red-300',
			bg: 'bg-linear-to-r from-red-500 to-pink-600',
			icon: '🏆',
			description: 'Превосходное чувство пространства!'
		};
		if (acc >= 60) return {
			name: 'Опытный Навигатор',
			color: 'text-yellow-300',
			bg: 'bg-linear-to-r from-yellow-500 to-orange-600',
			icon: '⭐',
			description: 'Отличные результаты!'
		};
		if (acc >= 30) return {
			name: 'Уверенный Новичок',
			color: 'text-green-300',
			bg: 'bg-linear-to-r from-green-500 to-emerald-600',
			icon: '🚀',
			description: 'Хороший прогресс!'
		};
		return {
			name: 'Начинающий Искатель',
			color: 'text-blue-300',
			bg: 'bg-linear-to-r from-blue-500 to-cyan-600',
			icon: '🌱',
			description: 'Продолжайте тренироваться!'
		};
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
		const radius = Math.min(width, height) * 0.35;

		ctx.clearRect(0, 0, width, height);

		// Gradient background
		const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
		gradient.addColorStop(0, 'rgba(79, 70, 229, 0.1)');
		gradient.addColorStop(1, 'rgba(147, 51, 234, 0.05)');
		ctx.fillStyle = gradient;
		ctx.fillRect(0, 0, width, height);

		const correct = stats.correctAttempts;
		const incorrect = stats.totalAttempts - correct;

		if (stats.totalAttempts === 0) {
			ctx.beginPath();
			ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
			ctx.fillStyle = 'rgba(59, 130, 246, 0.2)';
			ctx.fill();
			ctx.strokeStyle = 'rgba(99, 102, 241, 0.5)';
			ctx.lineWidth = 3;
			ctx.stroke();

			ctx.fillStyle = '#c7d2fe';
			ctx.font = 'bold 18px Arial';
			ctx.textAlign = 'center';
			ctx.textBaseline = 'middle';
			ctx.fillText('📊 Нет данных', centerX, centerY);
			return;
		}

		const correctPercentage = (correct / stats.totalAttempts) * 100;
		const incorrectPercentage = (incorrect / stats.totalAttempts) * 100;

		// Correct segment
		ctx.beginPath();
		ctx.moveTo(centerX, centerY);
		ctx.arc(centerX, centerY, radius, 0, (correctPercentage / 100) * 2 * Math.PI);
		ctx.closePath();

		const correctGradient = ctx.createLinearGradient(0, 0, width, 0);
		correctGradient.addColorStop(0, '#10b981');
		correctGradient.addColorStop(1, '#34d399');
		ctx.fillStyle = correctGradient;
		ctx.fill();

		// Incorrect segment
		ctx.beginPath();
		ctx.moveTo(centerX, centerY);
		ctx.arc(centerX, centerY, radius,
			(correctPercentage / 100) * 2 * Math.PI,
			2 * Math.PI);
		ctx.closePath();

		const incorrectGradient = ctx.createLinearGradient(0, 0, width, 0);
		incorrectGradient.addColorStop(0, '#ef4444');
		incorrectGradient.addColorStop(1, '#f87171');
		ctx.fillStyle = incorrectGradient;
		ctx.fill();

		// Outer border
		ctx.beginPath();
		ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
		ctx.strokeStyle = 'rgba(99, 102, 241, 0.8)';
		ctx.lineWidth = 4;
		ctx.stroke();

		// Inner circle
		ctx.beginPath();
		ctx.arc(centerX, centerY, radius * 0.5, 0, 2 * Math.PI);
		ctx.fillStyle = 'rgba(30, 41, 59, 0.9)';
		ctx.fill();

		// Center text
		ctx.fillStyle = '#ffffff';
		ctx.font = 'bold 24px Arial';
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		ctx.fillText(`${totalAccuracy.toFixed(1)}%`, centerX, centerY - 5);

		ctx.font = '14px Arial';
		ctx.fillStyle = '#c7d2fe';
		ctx.fillText('Общая точность', centerX, centerY + 20);

		// Legend
		const legendX = centerX;
		const legendY = centerY + radius + 50;
		const legendItemHeight = 25;
		const legendSquareSize = 16;

		ctx.fillStyle = '#10b981';
		ctx.fillRect(legendX - 50, legendY, legendSquareSize, legendSquareSize);
		ctx.fillStyle = '#ffffff';
		ctx.font = 'bold 14px Arial';
		ctx.textAlign = 'left';
		ctx.fillText(`✅ Правильные: ${correct} (${correctPercentage.toFixed(1)}%)`,
			legendX - 25, legendY + 12);

		ctx.fillStyle = '#ef4444';
		ctx.fillRect(legendX - 50, legendY + legendItemHeight, legendSquareSize, legendSquareSize);
		ctx.fillStyle = '#ffffff';
		ctx.fillText(`❌ Неправильные: ${incorrect} (${incorrectPercentage.toFixed(1)}%)`,
			legendX - 25, legendY + legendItemHeight + 12);

	}, [stats, totalAccuracy]);

	return (
		<div className="max-w-6xl mx-auto space-y-8 p-4">
			<div className="bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 rounded-3xl p-8 border-2 border-purple-500/30 shadow-2xl">
				<div className="text-center mb-8">
					<h2 className="text-4xl font-bold bg-linear-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent mb-3">
						Статистика Тренировок
					</h2>
					<p className="text-xl text-blue-300 flex items-center justify-center gap-2">
						<BarChart3 className="w-6 h-6" />
						Режим {currentMode.toUpperCase()} • Точность: {accuracy.toFixed(1)}%
					</p>
				</div>

				<div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
					<div className="bg-gradient-to-br from-blue-800/50 to-purple-800/50 p-6 rounded-2xl border-2 border-blue-500/30 text-center hover:border-green-500/50 transition-all duration-300 group">
						<div className="text-3xl font-bold text-green-400 flex items-center justify-center gap-3 mb-3 group-hover:scale-110 transition-transform">
							<Target className="w-8 h-8" />
							{modeStats.totalAttempts}
						</div>
						<div className="text-blue-200 font-semibold">Всего попыток</div>
						<div className="text-green-300 text-sm mt-1">Активность</div>
					</div>

					<div className="bg-gradient-to-br from-blue-800/50 to-purple-800/50 p-6 rounded-2xl border-2 border-blue-500/30 text-center hover:border-blue-500/50 transition-all duration-300 group">
						<div className="text-3xl font-bold text-blue-400 flex items-center justify-center gap-3 mb-3 group-hover:scale-110 transition-transform">
							<TrendingUp className="w-8 h-8" />
							{accuracy.toFixed(1)}%
						</div>
						<div className="text-blue-200 font-semibold">Точность</div>
						<div className="text-blue-300 text-sm mt-1">Эффективность</div>
					</div>

					<div className="bg-gradient-to-br from-blue-800/50 to-purple-800/50 p-6 rounded-2xl border-2 border-blue-500/30 text-center hover:border-yellow-500/50 transition-all duration-300 group">
						<div className="text-3xl font-bold text-yellow-400 flex items-center justify-center gap-3 mb-3 group-hover:scale-110 transition-transform">
							<Zap className="w-8 h-8" />
							{modeStats.currentStreak}
						</div>
						<div className="text-blue-200 font-semibold">Текущая серия</div>
						<div className="text-yellow-300 text-sm mt-1">Моментальный успех</div>
					</div>

					<div className="bg-gradient-to-br from-blue-800/50 to-purple-800/50 p-6 rounded-2xl border-2 border-blue-500/30 text-center hover:border-red-500/50 transition-all duration-300 group">
						<div className="text-3xl font-bold text-red-400 flex items-center justify-center gap-3 mb-3 group-hover:scale-110 transition-transform">
							<Crown className="w-8 h-8" />
							{modeStats.bestStreak}
						</div>
						<div className="text-blue-200 font-semibold">Лучшая серия</div>
						<div className="text-red-300 text-sm mt-1">Рекорд</div>
					</div>
				</div>

				<div className="bg-linear-to-r from-purple-900/50 to-blue-900/50 p-8 rounded-2xl border-2 border-purple-500/30">
					<h3 className="text-2xl font-bold text-center mb-6 text-white flex items-center justify-center gap-3">
						<Trophy className="w-7 h-7 text-yellow-400" />
						Уровень Мастерства
					</h3>

					<div className="text-center mb-6">
						<div className="text-4xl font-bold mb-3">
							<span className={currentLevel.color}>{currentLevel.icon} {currentLevel.name}</span>
						</div>
						<p className="text-blue-300 text-lg mb-4">{currentLevel.description}</p>
						<div className="text-2xl font-bold text-green-400">
							Точность: {accuracy.toFixed(1)}%
						</div>
					</div>

					<div className="space-y-4">
						<div className="w-full bg-gray-700 rounded-full h-6 overflow-hidden border-2 border-gray-600">
							<div
								className={`h-6 rounded-full transition-all duration-1000 ease-out ${currentLevel.bg} shadow-lg`}
								style={{ width: `${Math.min(100, accuracy)}%` }}
							></div>
						</div>

						<div className="flex justify-between text-sm font-semibold">
							<span className="text-blue-300">🌱 Начинающий (0%)</span>
							<span className="text-green-300">🚀 Уверенный (30%)</span>
							<span className="text-yellow-300">⭐ Опытный (60%)</span>
							<span className="text-red-300">🏆 Мастер (85%)</span>
						</div>
					</div>
				</div>
			</div>

			<div className="bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 rounded-3xl p-8 border-2 border-purple-500/30 shadow-2xl">
				<h3 className="text-3xl font-bold text-center mb-8 text-white flex items-center justify-center gap-3">
					<Activity className="w-8 h-8 text-green-400" />
					Анализ Эффективности
				</h3>

				<div className="flex flex-col lg:flex-row items-center justify-between gap-8">
					<div className="flex-1 bg-gradient-to-br from-blue-900/30 to-purple-900/30 p-6 rounded-2xl border-2 border-blue-500/20">
						<div className="text-center mb-4">
							<h4><span className='text-xl font-bold text-white mb-2 flex items-center justify-center gap-2'><ChartPie className='h-6 w-6' />Визуализация Результатов</span></h4>
							<p className="text-blue-300">Общая статистика точности</p>
						</div>
						<canvas
							ref={canvasRef}
							width={400}
							height={350}
							className="w-full max-w-md mx-auto bg-gradient-to-br from-blue-900/20 to-purple-900/20 rounded-xl p-4 border border-blue-500/10"
						/>
					</div>

					<div className="flex-1 bg-gradient-to-br from-purple-900/30 to-blue-900/30 p-6 rounded-2xl border-2 border-purple-500/20">
						<h4 className="text-2xl font-bold text-center mb-6 text-white flex items-center justify-center gap-2">
							<Users className="w-6 h-6" />
							Сводка Производительности
						</h4>

						<div className="space-y-4">
							{[
								{ label: '🎯 Всего попыток:', value: stats.totalAttempts, color: 'text-white' },
								{ label: '✅ Правильные ответы:', value: stats.correctAttempts, color: 'text-green-400' },
								{ label: '❌ Неправильные ответы:', value: stats.totalAttempts - stats.correctAttempts, color: 'text-red-400' },
								{ label: '📊 Общая точность:', value: `${totalAccuracy.toFixed(1)}%`, color: 'text-yellow-400' },
								{ label: '⚡ Текущая серия:', value: stats.currentStreak, color: 'text-purple-400' },
								{ label: '👑 Лучшая серия:', value: stats.bestStreak, color: 'text-pink-400' },
							].map((item, index) => (
								<div key={index} className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all group">
									<span className="text-blue-200 font-semibold group-hover:text-white transition-colors">
										{item.label}
									</span>
									<span className={`text-lg font-bold ${item.color} group-hover:scale-110 transition-transform`}>
										{item.value}
									</span>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>

			<div className="bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 rounded-3xl p-8 border-2 border-purple-500/30 shadow-2xl">
				<h3 className="text-3xl font-bold text-center mb-8 text-white flex items-center justify-center gap-3">
					<TrendingUp className="w-8 h-8 text-green-400" />
					Сравнение Режимов
				</h3>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
					<div className="bg-gradient-to-br from-green-900/30 to-blue-900/30 p-6 rounded-2xl border-2 border-green-500/30 hover:border-green-400/50 transition-all group">
						<h4 className="text-2xl font-bold mb-4 text-green-400 flex items-center gap-3">
							<div className="p-2 bg-green-500/20 rounded-lg">
								<span>🎯</span>
							</div>
							2D Режим
						</h4>
						<div className="space-y-4">
							{[
								{ label: 'Попытки:', value: stats.modeStats['2d'].totalAttempts, icon: '🎯' },
								{ label: 'Точность:', value: `${(stats.modeStats['2d'].totalAttempts > 0 ? (stats.modeStats['2d'].correctAttempts / stats.modeStats['2d'].totalAttempts) * 100 : 0).toFixed(1)}%`, icon: '📊' },
								{ label: 'Лучшая серия:', value: stats.modeStats['2d'].bestStreak, icon: '👑' },
							].map((item, index) => (
								<div key={index} className="flex justify-between items-center p-3 bg-white/5 rounded-lg group-hover:bg-white/10 transition-all">
									<span className="text-green-300 font-semibold flex items-center gap-2">
										{item.icon} {item.label}
									</span>
									<span className="text-white font-bold text-lg">{item.value}</span>
								</div>
							))}
						</div>
					</div>

					<div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 p-6 rounded-2xl border-2 border-purple-500/30 hover:border-purple-400/50 transition-all group">
						<h4 className="text-2xl font-bold mb-4 text-purple-400 flex items-center gap-3">
							<div className="p-2 bg-purple-500/20 rounded-lg">
								<span>🎮</span>
							</div>
							3D Режим
						</h4>
						<div className="space-y-4">
							{[
								{ label: 'Попытки:', value: stats.modeStats['3d'].totalAttempts, icon: '🎮' },
								{ label: 'Точность:', value: `${(stats.modeStats['3d'].totalAttempts > 0 ? (stats.modeStats['3d'].correctAttempts / stats.modeStats['3d'].totalAttempts) * 100 : 0).toFixed(1)}%`, icon: '📈' },
								{ label: 'Лучшая серия:', value: stats.modeStats['3d'].bestStreak, icon: '🏆' },
							].map((item, index) => (
								<div key={index} className="flex justify-between items-center p-3 bg-white/5 rounded-lg group-hover:bg-white/10 transition-all">
									<span className="text-purple-300 font-semibold flex items-center gap-2">
										{item.icon} {item.label}
									</span>
									<span className="text-white font-bold text-lg">{item.value}</span>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>

			<div className="text-center">
				<div className="bg-linear-to-r from-green-500/20 to-blue-500/20 p-6 rounded-2xl border-2 border-green-500/30">
					<p className="text-green-300 text-lg font-semibold mb-2">
						🚀 Статистика сохраняется автоматически
					</p>
					<p className="text-blue-300">
						Продолжайте тренировки для улучшения пространственного слуха!
					</p>
				</div>
			</div>
		</div>
	);
}