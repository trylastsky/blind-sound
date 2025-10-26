import { SoundType } from "@/app/types/audio/SoundType";
import { ObstacleType } from "../canvas/Obstacle";

export interface TrainerSettings {
    difficulty: 'easy' | 'medium' | 'hard';
    obstacleType: ObstacleType;
    soundType: SoundType;
    volume: number;
}