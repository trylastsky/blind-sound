"use client";
import { useState, useEffect } from "react";
import SoundTrainer from "./components/SoundTrainer/SoundTrainer";
import Stats from "./components/Stats";
import HelpModal from "./components/helper/HelpModal";
import {
    Headphones,
    Gamepad2,
    ChartArea,
    Axis3D,
} from "lucide-react";
import { SoundWavesIcon } from "./components/icons";

export interface StatsData {
    totalAttempts: number;
    correctAttempts: number;
    currentStreak: number;
    bestStreak: number;
    modeStats: {
        "2d": StatsData;
        "3d": StatsData;
    };
}

const initialStats: StatsData = {
    totalAttempts: 0,
    correctAttempts: 0,
    currentStreak: 0,
    bestStreak: 0,
    modeStats: {
        "2d": {
            totalAttempts: 0,
            correctAttempts: 0,
            currentStreak: 0,
            bestStreak: 0,
            modeStats: {} as never,
        },
        "3d": {
            totalAttempts: 0,
            correctAttempts: 0,
            currentStreak: 0,
            bestStreak: 0,
            modeStats: {} as never,
        },
    },
};

export default function Home() {
    const [currentView, setCurrentView] = useState<
        "instructions" | "trainer" | "stats"
    >("trainer");
    const [stats, setStats] = useState<StatsData>(initialStats);
    const [currentMode, setCurrentMode] = useState<"2d" | "3d">("2d");
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const savedStats = localStorage.getItem("soundTrainerStats");
        const savedView = localStorage.getItem("soundTrainerView");
        const savedMode = localStorage.getItem("soundTrainerMode");

        if (savedStats) {
            try {
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setStats(JSON.parse(savedStats));
            } catch (e) {
                console.error("Error loading stats from localStorage:", e);
            }
        }

        if (savedView) {
            setCurrentView(savedView as "instructions" | "trainer" | "stats");
        }

        if (savedMode) {
            setCurrentMode(savedMode as "2d" | "3d");
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("soundTrainerStats", JSON.stringify(stats));
    }, [stats]);

    useEffect(() => {
        localStorage.setItem("soundTrainerView", currentView);
    }, [currentView]);

    useEffect(() => {
        localStorage.setItem("soundTrainerMode", currentMode);
    }, [currentMode]);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <main className="min-h-screen bg-linear-to-br from-blue-900 via-purple-900 to-indigo-900 text-white pt-24">
            {" "}
            <header
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                        ? "bg-linear-to-r from-blue-900/95 via-purple-900/95 to-indigo-900/95 backdrop-blur-lg border-b border-purple-500/30 shadow-2xl"
                        : "bg-linear-to-r from-blue-900/80 via-purple-900/80 to-indigo-900/80 backdrop-blur-md"
                    }`}
            >
                <div className="container mx-auto px-4 py-4">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="text-center sm:text-left">
                            <h1 className="text-2xl sm:text-3xl font-bold flex items-center justify-center sm:justify-start">
                                <div className="relative">
                            <SoundWavesIcon className="w-12 h-12" />
                                </div>
                                <span className="bg-linear-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
                                    Blind Sound
                                </span>
                                <span className="ml-2 inline-flex items-center px-2 rounded-full text-sm font-bold bg-linear-to-r from-green-500 to-emerald-600 text-white border-2 border-emerald-400/50 shadow-lg">
                                    demo
                                </span>
                            </h1>
                            <p className="text-blue-200 text-sm sm:text-base flex items-center justify-center sm:justify-start gap-2 mt-1">
                                <span className="hidden sm:inline"><Headphones className="w-4 h-4
                                "/></span>
                                Развивайте пространственный слух
                            </p>
                        </div>

                        <div className="flex items-center gap-4">
                            <nav className="bg-blue-800/50 rounded-xl p-1 border border-blue-600/30">
                                <div className="flex flex-wrap justify-center gap-1">
                                    <button
                                        onClick={() => setCurrentView("trainer")}
                                        className={`px-3 py-2 rounded-lg cursor-pointer transition-all duration-200 flex items-center gap-2 text-sm ${currentView === "trainer"
                                                ? "bg-linear-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                                                : "text-blue-200 hover:bg-blue-700/50"
                                            }`}
                                    >
                                        <Gamepad2 className="w-4 h-4" />
                                        Тренажер
                                    </button>
                                    <button
                                        onClick={() => setCurrentView("stats")}
                                        className={`px-3 py-2 rounded-lg cursor-pointer transition-all duration-200 flex items-center gap-2 text-sm ${currentView === "stats"
                                                ? "bg-linear-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                                                : "text-blue-200 hover:bg-blue-700/50"
                                            }`}
                                    >
                                        <ChartArea className="w-4 h-4" />
                                        Статистика
                                    </button>
                                </div>
                            </nav>

                            <div className="flex items-center space-x-2">
                                <span className="text-blue-200 text-sm flex items-center gap-1 sm:flex">
                                    <Axis3D className="w-4 h-4" />
                                    Режим:
                                </span>
                                <select
                                    value={currentMode}
                                    onChange={(e) =>
                                        setCurrentMode(e.target.value as "2d" | "3d")
                                    }
                                    className="cursor-pointer bg-blue-700/80 border border-blue-600/50 rounded-lg px-3 py-2 text-white text-sm hover:bg-blue-600/80 transition-colors backdrop-blur-sm"
                                >
                                    <option value="2d">2D</option>
                                    <option value="3d">3D</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
            <div className="container mx-auto px-4 py-8">
                {currentView === "trainer" && (
                    <SoundTrainer
                        stats={stats}
                        setStats={setStats}
                        currentMode={currentMode}
                    />
                )}
                {currentView === "stats" && (
                    <Stats stats={stats} currentMode={currentMode} />
                )}

                <HelpModal currentMode={currentMode} />
            </div>
           <footer className="bg-linear-to-r from-blue-900/50 to-purple-900/50 border-t border-purple-500/30 mt-16">
                    <div className="container mx-auto px-4 py-6">
                        <div className="text-center">
                            <div className="mt-4 items-align">
                                <p className="flex flex-col text-blue-300 text-sm">
                            <span className="text-base"><span className="text-xs">©</span> Blind Sound</span>
                            <span className="text-shadow-indigo-500 text-sm">Trylastsky</span>
                            <span className="text-xs">{new Date().getFullYear()}г.</span>
                            
                            </p>
                        </div>
                        </div>
                    </div>
                    </footer>
        </main>
    );
}
