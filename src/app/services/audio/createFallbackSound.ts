import { SoundType } from "@/app/types/SoundType";
import { Context } from "vm";

export const createFallbackSound = (type: SoundType, audioContextRef: Context): AudioBuffer => {
    if (!audioContextRef.current) throw new Error('AudioContext not initialized');

    const context = audioContextRef.current;
    const duration = type === 'ocean' ? 3 : 1.5;
    const sampleRate = context.sampleRate;
    const frameCount = sampleRate * duration;
    const buffer = context.createBuffer(2, frameCount, sampleRate);

    for (let channel = 0; channel < 2; channel++) {
        const data = buffer.getChannelData(channel);

        switch (type) {
            case 'bell':
                for (let i = 0; i < frameCount; i++) {
                    const t = i / sampleRate;
                    const freq = 800 * Math.exp(-t * 2);
                    data[i] = Math.sin(2 * Math.PI * freq * t) * Math.exp(-t * 8) * 0.5;
                }
                break;
            case 'chime':
                for (let i = 0; i < frameCount; i++) {
                    const t = i / sampleRate;
                    data[i] = (
                        Math.sin(2 * Math.PI * 440 * t) * 0.3 +
                        Math.sin(2 * Math.PI * 880 * t) * 0.2 +
                        Math.sin(2 * Math.PI * 1320 * t) * 0.1
                    ) * Math.exp(-t * 4) * 0.6;
                }
                break;
            case 'kalimba':
                for (let i = 0; i < frameCount; i++) {
                    const t = i / sampleRate;
                    data[i] = Math.sin(2 * Math.PI * 392 * t) *
                        Math.exp(-t * 3) *
                        (1 + 0.3 * Math.sin(2 * Math.PI * 5 * t)) * 0.4;
                }
                break;
            case 'marimba':
                for (let i = 0; i < frameCount; i++) {
                    const t = i / sampleRate;
                    data[i] = (
                        Math.sin(2 * Math.PI * 261 * t) * 0.4 +
                        Math.sin(2 * Math.PI * 523 * t) * 0.3 +
                        Math.sin(2 * Math.PI * 784 * t) * 0.2
                    ) * Math.exp(-t * 6) * 0.5;
                }
                break;
            case 'singingBowl':
                for (let i = 0; i < frameCount; i++) {
                    const t = i / sampleRate;
                    data[i] = Math.sin(2 * Math.PI * 110 * t) *
                        Math.exp(-t * 1.5) *
                        (1 + 0.2 * Math.sin(2 * Math.PI * 3 * t)) * 0.3;
                }
                break;
            case 'guitar':
                for (let i = 0; i < frameCount; i++) {
                    const t = i / sampleRate;
                    data[i] = (
                        Math.sin(2 * Math.PI * 196 * t) * 0.3 +
                        Math.sin(2 * Math.PI * 294 * t) * 0.2 +
                        Math.sin(2 * Math.PI * 392 * t) * 0.1
                    ) * Math.exp(-t * 4) * 0.5;
                }
                break;
            case 'piano':
                for (let i = 0; i < frameCount; i++) {
                    const t = i / sampleRate;
                    data[i] = (
                        Math.sin(2 * Math.PI * 523 * t) * 0.4 +
                        Math.sin(2 * Math.PI * 659 * t) * 0.3 +
                        Math.sin(2 * Math.PI * 784 * t) * 0.2
                    ) * Math.exp(-t * 5) * 0.4;
                }
                break;
            case 'flute':
                for (let i = 0; i < frameCount; i++) {
                    const t = i / sampleRate;
                    data[i] = Math.sin(2 * Math.PI * 880 * t) *
                        (1 + 0.1 * Math.sin(2 * Math.PI * 5 * t)) *
                        Math.exp(-t * 3) * 0.3;
                }
                break;
            case 'xylophone':
                for (let i = 0; i < frameCount; i++) {
                    const t = i / sampleRate;
                    data[i] = (
                        Math.sin(2 * Math.PI * 1047 * t) * 0.3 +
                        Math.sin(2 * Math.PI * 1319 * t) * 0.2 +
                        Math.sin(2 * Math.PI * 1568 * t) * 0.1
                    ) * Math.exp(-t * 8) * 0.6;
                }
                break;
            case 'ocean':
                for (let i = 0; i < frameCount; i++) {
                    const t = i / sampleRate;
                    data[i] = (
                        Math.sin(2 * Math.PI * 80 * t) * 0.1 +
                        Math.sin(2 * Math.PI * 160 * t) * 0.05 +
                        (Math.random() * 2 - 1) * 0.02
                    ) * (0.7 + 0.3 * Math.sin(2 * Math.PI * 0.2 * t)) * 0.4;
                }
                break;
        }
    }

    return buffer;
};
