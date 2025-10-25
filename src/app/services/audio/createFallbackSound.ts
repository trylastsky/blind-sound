import { SoundType } from "@/app/types/SoundType";
import { Context } from "vm";

export const createFallbackSound = (type: SoundType, audioContextRef: Context): AudioBuffer => {
    if (!audioContextRef.current) throw new Error('AudioContext not initialized');

    const context = audioContextRef.current;
    const duration = type === 'ocean' ? 4 : type === 'wind' ? 3 : 1.5;
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
                let lastOceanValue = 0;
                const oceanFilter = 0.95;
                
                for (let i = 0; i < frameCount; i++) {
                    const t = i / sampleRate;
                    const wave = Math.sin(2 * Math.PI * 0.3 * t) * 0.4;
                    const noise = (Math.random() * 2 - 1);
                    lastOceanValue = oceanFilter * lastOceanValue + (1 - oceanFilter) * noise;
                    const splash = (Math.random() * 2 - 1) * Math.exp(-t * 0.5) * 0.2;
                    const waveEnvelope = 0.6 + 0.3 * Math.sin(2 * Math.PI * 0.1 * t);
                    const attackDecay = Math.min(t * 2, 1) * (1 - t / duration);
                    
                    data[i] = (wave + lastOceanValue * 0.5 + splash) * waveEnvelope * attackDecay * 0.4;
                }
                break;
            case 'wind':
                let lastWindValue = 0;
                const windFilters = [0.92, 0.85];
                let windPhase = 0;
                
                for (let i = 0; i < frameCount; i++) {
                    const t = i / sampleRate;
                    
                    let windNoise = (Math.random() * 2 - 1);
                    for (const filter of windFilters) {
                        lastWindValue = filter * lastWindValue + (1 - filter) * windNoise;
                        windNoise = lastWindValue;
                    }
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    windPhase += 0.15;
                    const gust = Math.sin(2 * Math.PI * 0.08 * t + Math.sin(2 * Math.PI * 0.03 * t) * 2);
                    const gustEnvelope = 0.7 + 0.3 * gust;
                    const whistle = Math.sin(2 * Math.PI * 800 * t + Math.sin(2 * Math.PI * 5 * t) * 10) * 0.1;
                    const envelope = Math.min(t * 3, 1) * (1 - t / duration);
                    
                    data[i] = (windNoise * gustEnvelope + whistle) * envelope * 0.3;
                }
                break;
        }
    }

    return buffer;
};