export interface InstructionSection {
  title: string;
  icon: string;
  color: string;
  content: string | string[];
}

export interface SoundTypeInfo {
  emoji: string;
  name: string;
}

export interface ObstacleInfo {
  emoji: string;
  name: string;
  description: string;
}

export const soundTypes: Record<string, SoundTypeInfo> = {
  bell: { emoji: "🔔", name: "Колокольчик" },
  wind: { emoji: "🎐", name: "Ветерок" },
  kalimba: { emoji: "🎵", name: "Калимба" },
  marimba: { emoji: "🎹", name: "Маримба" },
  singingBowl: { emoji: "🪘", name: "Поющая чаша" },
  guitar: { emoji: "🎸", name: "Гитара" },
  piano: { emoji: "🎹", name: "Пианино" },
  flute: { emoji: "🎶", name: "Флейта" },
  xylophone: { emoji: "🥁", name: "Ксилофон" },
  ocean: { emoji: "🌊", name: "Океан" }
};

export const obstacles: Record<string, ObstacleInfo> = {
  wall: { emoji: "🧱", name: "Стена", description: "частично блокирует звук" },
  pillar: { emoji: "🪨", name: "Колонна", description: "рассеивает звуковые волны" },
  corner: { emoji: "📐", name: "Угол", description: "создает звуковые отражения" },
  tunnel: { emoji: "🕳️", name: "Тоннель", description: "создает резонанс" },
  maze: { emoji: "🌀", name: "Лабиринт", description: "сложные акустические условия" },
  none: { emoji: "❌", name: "Нет", description: "препятствия отсутствуют" }
};

export const getInstructions = (currentMode: "2d" | "3d"): InstructionSection[] => [
  {
    title: "🎯 Цель тренажера",
    icon: "🎯",
    color: "text-green-400",
    content: "Развить способность точно определять направление источника звука в 2D и 3D пространстве, с различными акустическими условиями."
  },
  {
    title: "👂 Для кого это",
    icon: "👂",
    color: "text-blue-400",
    content: [
      "Люди с нормальным слухом, но трудностями локализации",
      "Геймеры для улучшения пространственного слуха",
      "Музыканты и звукорежиссеры",
      "Все, кто хочет развить аудиальные навыки"
    ]
  },
  {
    title: "🎮 Как тренироваться",
    icon: "🎮",
    color: "text-yellow-400",
    content: currentMode === "3d" 
      ? [
          "Нажмите 'Новый звук'",
          "Внимательно слушайте откуда исходит звук в 3D пространстве",
          "Кликните на круге в предполагаемом направлении (X,Y)",
          "Используйте ползунок для установки глубины (Z)",
          "Анализируйте результат и повторяйте"
        ]
      : [
          "Нажмите 'Новый звук'",
          "Внимательно слушайте откуда исходит звук",
          "Кликните на круге в предполагаемом направлении",
          "Анализируйте результат и повторяйте"
        ]
  },
  {
    title: "🎧 Важно для точности",
    icon: "🎧",
    color: "text-purple-400",
    content: [
      "Используйте стерео наушники",
      "Установите комфортную громкость",
      "Занимайтесь в тихой обстановке"
    ]
  }
];

export const get3DInstructions = (): InstructionSection => ({
  title: "🌐 3D Режим",
  icon: "🌐",
  color: "text-purple-300",
  content: "В 3D режиме добавляется глубина звука. Используйте ползунок 'Глубина (Z)' чтобы указать, находится ли звук спереди, сзади или на том же уровне, что и слушатель."
});