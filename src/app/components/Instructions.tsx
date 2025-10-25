interface InstructionsProps {
    currentMode: "2d" | "3d";
}

export default function Instructions({ currentMode }: InstructionsProps) {
    return (
        <div className="max-w-4xl mx-auto bg-blue-800 rounded-xl p-8 space-y-6">
            <h2 className="text-3xl font-bold text-center mb-6">
                Инструкция - Режим {currentMode.toUpperCase()}
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div className="bg-blue-700 p-4 rounded-lg">
                        <h3 className="text-xl font-semibold mb-2 text-green-400">
                            🎯 Цель тренажера
                        </h3>
                        <p>
                            Развить способность точно определять направление источника звука в
                            2D и 3D пространстве, с различными акустическими условиями.
                        </p>
                    </div>

                    <div className="bg-blue-700 p-4 rounded-lg">
                        <h3 className="text-xl font-semibold mb-2 text-blue-400">
                            👂 Для кого это
                        </h3>
                        <ul className="list-disc list-inside space-y-1">
                            <li>Люди с нормальным слухом, но трудностями локализации</li>
                            <li>Геймеры для улучшения пространственного слуха</li>
                            <li>Музыканты и звукорежиссеры</li>
                            <li>Все, кто хочет развить аудиальные навыки</li>
                        </ul>
                    </div>

                    <div className="bg-blue-700 p-4 rounded-lg">
                        <h3 className="text-xl font-semibold mb-2 text-purple-400">
                            🎵 Типы звуков
                        </h3>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="flex items-center space-x-1">
                                <span>🔔</span>
                                <span>Колокольчик</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <span>🎐</span>
                                <span>Ветерок</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <span>🎵</span>
                                <span>Калимба</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <span>🎹</span>
                                <span>Маримба</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <span>🪘</span>
                                <span>Поющая чаша</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <span>🎸</span>
                                <span>Гитара</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <span>🎹</span>
                                <span>Пианино</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <span>🎶</span>
                                <span>Флейта</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <span>🥁</span>
                                <span>Ксилофон</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <span>🌊</span>
                                <span>Океан</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="bg-blue-700 p-4 rounded-lg">
                        <h3 className="text-xl font-semibold mb-2 text-yellow-400">
                            🎮 Как тренироваться
                        </h3>
                        {currentMode === "3d" ? (
                            <ol className="list-decimal list-inside space-y-2">
                                <li>Нажмите "Новый звук"</li>
                                <li>
                                    Внимательно слушайте откуда исходит звук в 3D пространстве
                                </li>
                                <li>Кликните на круге в предполагаемом направлении (X,Y)</li>
                                <li>Используйте ползунок для установки глубины (Z)</li>
                                <li>Анализируйте результат и повторяйте</li>
                            </ol>
                        ) : (
                            <ol className="list-decimal list-inside space-y-2">
                                <li>Нажмите "Новый звук"</li>
                                <li>Внимательно слушайте откуда исходит звук</li>
                                <li>Кликните на круге в предполагаемом направлении</li>
                                <li>Анализируйте результат и повторяйте</li>
                            </ol>
                        )}
                    </div>

                    <div className="bg-blue-700 p-4 rounded-lg">
                        <h3 className="text-xl font-semibold mb-2 text-red-400">
                            🧱 Препятствия
                        </h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex items-center space-x-2">
                                <span>🧱</span>
                                <span>
                                    <strong>Стена</strong> - частично блокирует звук
                                </span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span>🪨</span>
                                <span>
                                    <strong>Колонна</strong> - рассеивает звуковые волны
                                </span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span>📐</span>
                                <span>
                                    <strong>Угол</strong> - создает звуковые отражения
                                </span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span>🕳️</span>
                                <span>
                                    <strong>Тоннель</strong> - создает резонанс
                                </span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span>🌀</span>
                                <span>
                                    <strong>Лабиринт</strong> - сложные акустические условия
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-blue-900 p-6 rounded-lg mt-6">
                <h3 className="text-xl font-semibold mb-3 text-center">
                    🎧 Важно для точности
                </h3>
                <div className="grid md:grid-cols-3 gap-4 text-center">
                    <div>
                        <div className="text-2xl mb-2">🎛️</div>
                        <p>Используйте стерео наушники</p>
                    </div>
                    <div>
                        <div className="text-2xl mb-2">🔊</div>
                        <p>Установите комфортную громкость</p>
                    </div>
                    <div>
                        <div className="text-2xl mb-2">🌙</div>
                        <p>Занимайтесь в тихой обстановке</p>
                    </div>
                </div>
            </div>

            {currentMode === "3d" && (
                <div className="bg-purple-800 p-6 rounded-lg mt-4">
                    <h3 className="text-xl font-semibold mb-3 text-center text-purple-300">
                        🌐 3D Режим
                    </h3>
                    <div className="text-center">
                        <p className="mb-3">
                            В 3D режиме добавляется <strong>глубина звука</strong>.
                            Используйте ползунок "Глубина (Z)" чтобы указать, находится ли
                            звук спереди, сзади или на том же уровне, что и слушатель.
                        </p>
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
    );
}
