import {
    Bell,
    Wind,
    Music,
    Music2,
    Circle,
    Guitar,
    Piano,
    Drum,
    Waves,
    CircleOff,
    Cylinder,
    CornerDownRight,
    Torus,
    CircuitBoard,
    BrickWall
} from 'lucide-react';
import { JSX } from 'react';

export interface SoundDescription {
    icon: JSX.Element;
    name: string;
    desc: string;
}

export interface ObstacleDescription {
    icon: JSX.Element;
    name: string;
    desc: string;
}

export const soundDescriptions: Record<string, SoundDescription> = {
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

export const obstacleDescriptions: Record<string, ObstacleDescription> = {
    none: {
        icon: <CircleOff className="w-4 h-4" />,
        name: "Без препятствий",
        desc: "Чистый звук"
    },
    wall: {
        icon: <BrickWall className="w-4 h-4" />,
        name: "Стена",
        desc: "Частичная блокировка"
    },
    pillar: {
        icon: <Cylinder className="w-4 h-4" />,
        name: "Колонна",
        desc: "Рассеивание звука"
    },
    corner: {
        icon: <CornerDownRight className="w-4 h-4" />,
        name: "Угол",
        desc: "Отражения"
    },
    tunnel: {
        icon: <Torus className="w-4 h-4" />,
        name: "Тоннель",
        desc: "Резонанс"
    },
    maze: {
        icon: <CircuitBoard className="w-4 h-4" />,
        name: "Лабиринт",
        desc: "Сложные отражения"
    }
};