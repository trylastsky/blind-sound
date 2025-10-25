import {
  Target,
  Ear,
  Gamepad2,
  Headphones as HeadphonesIcon,
  Globe,
  Music,
  Bell,
  Wind,
  Music2,
  Circle,
  Guitar,
  Piano,
  Drum,
  Waves,
  Cylinder,
  CornerDownRight,
  Torus,
  CircuitBoard,
  CircleOff,
  BrickWall
} from 'lucide-react';
import { JSX } from 'react';

export interface InstructionSection {
  title: string;
  icon: JSX.Element;
  color: string;
  content: string | string[];
}

export interface SoundTypeInfo {
  icon: JSX.Element;
  name: string;
  desc: string;
}

export interface ObstacleInfo {
  icon: JSX.Element;
  name: string;
  description: string;
}

export const soundTypes: Record<string, SoundTypeInfo> = {
  bell: {
    icon: <Bell className="w-4 h-4" />,
    name: "Колокольчик",
    desc: "Чистый и ясный"
  },
  wind: {
    icon: <Wind className="w-4 h-4" />,
    name: "Ветерок",
    desc: "Нежный и воздушный"
  },
  kalimba: {
    icon: <Music className="w-4 h-4" />,
    name: "Калимба",
    desc: "Теплый и уютный"
  },
  marimba: {
    icon: <Music2 className="w-4 h-4" />,
    name: "Маримба",
    desc: "Насыщенный и глубокий"
  },
  singingBowl: {
    icon: <Circle className="w-4 h-4" />,
    name: "Поющая чаша",
    desc: "Медитативный"
  },
  guitar: {
    icon: <Guitar className="w-4 h-4" />,
    name: "Гитара",
    desc: "Мягкий и гармоничный"
  },
  piano: {
    icon: <Piano className="w-4 h-4" />,
    name: "Пианино",
    desc: "Классический и четкий"
  },
  flute: {
    icon: <Music className="w-4 h-4" />,
    name: "Флейта",
    desc: "Легкий и воздушный"
  },
  xylophone: {
    icon: <Drum className="w-4 h-4" />,
    name: "Ксилофон",
    desc: "Яркий и ритмичный"
  },
  ocean: {
    icon: <Waves className="w-4 h-4" />,
    name: "Океан",
    desc: "Естественный и успокаивающий"
  }
};

export const obstacles: Record<string, ObstacleInfo> = {
  wall: {
    icon: <BrickWall className="w-4 h-4" />,
    name: "Стена",
    description: "частично блокирует звук"
  },
  pillar: {
    icon: <Cylinder className="w-4 h-4" />,
    name: "Колонна",
    description: "рассеивает звуковые волны"
  },
  corner: {
    icon: <CornerDownRight className="w-4 h-4" />,
    name: "Угол",
    description: "создает звуковые отражения"
  },
  tunnel: {
    icon: <Torus className="w-4 h-4" />,
    name: "Тоннель",
    description: "создает резонанс"
  },
  maze: {
    icon: <CircuitBoard className="w-4 h-4" />,
    name: "Лабиринт",
    description: "сложные акустические условия"
  },
  none: {
    icon: <CircleOff className="w-4 h-4" />,
    name: "Нет",
    description: "препятствия отсутствуют"
  }
};

export const getInstructions = (currentMode: "2d" | "3d"): InstructionSection[] => [
  {
    title: "Цель тренажера",
    icon: <Target className="w-5 h-5" />,
    color: "text-green-400",
    content: "Развить способность точно определять направление источника звука в 2D и 3D пространстве, с различными акустическими условиями."
  },
  {
    title: "Для кого это",
    icon: <Ear className="w-5 h-5" />,
    color: "text-blue-400",
    content: [
      "Люди с нормальным слухом, но трудностями локализации",
      "Геймеры для улучшения пространственного слуха",
      "Музыканты и звукорежиссеры",
      "Все, кто хочет развить аудиальные навыки"
    ]
  },
  {
    title: "Как тренироваться",
    icon: <Gamepad2 className="w-5 h-5" />,
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
    title: "Важно для точности",
    icon: <HeadphonesIcon className="w-5 h-5" />,
    color: "text-purple-400",
    content: [
      "Используйте стерео наушники",
      "Установите комфортную громкость",
      "Занимайтесь в тихой обстановке"
    ]
  }
];

export const get3DInstructions = (): InstructionSection => ({
  title: "3D Режим",
  icon: <Globe className="w-5 h-5" />,
  color: "text-purple-300",
  content: "В 3D режиме добавляется глубина звука. Используйте ползунок 'Глубина (Z)' чтобы указать, находится ли звук спереди, сзади или на том же уровне, что и слушатель."
});

export const SoundTypeDisplay = ({ type }: { type: string }) => {
  const sound = soundTypes[type];
  if (!sound) return null;

  return (
    <div className="flex items-center gap-2">
      {sound.icon}
      <span>{sound.name}</span>
    </div>
  );
};

export const ObstacleDisplay = ({ type }: { type: string }) => {
  const obstacle = obstacles[type];
  if (!obstacle) return null;

  return (
    <div className="flex items-center gap-2">
      {obstacle.icon}
      <span>{obstacle.name}</span>
    </div>
  );
};