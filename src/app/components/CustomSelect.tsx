import { ChevronDown } from "lucide-react";
import { JSX, useEffect, useRef, useState } from "react";

interface CustomSelectProps {
    value: string;
    onChange: (value: string) => void;
    options: Array<{ value: string; label: string; icon: JSX.Element }>;
    className?: string;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({ value, onChange, options, className }) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find(opt => opt.value === value) || options[0];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div ref={selectRef} className={`relative ${className}`}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="cursor-pointer w-full bg-linear-to-br from-blue-800 to-purple-800 border-2 border-purple-500/30 rounded-xl px-4 py-3 text-white text-sm flex items-center justify-between hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-purple-500/20"
            >
                <div className="flex items-center space-x-3">
                    <div className="text-purple-300">
                        {selectedOption.icon}
                    </div>
                    <span className="font-semibold">{selectedOption.label}</span>
                </div>
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute z-10 w-full mt-2 bg-linear-to-br from-gray-900 to-blue-900 border-2 border-purple-500/30 rounded-xl shadow-2xl shadow-purple-500/20 max-h-60 overflow-auto">
                    {options.map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => {
                                onChange(option.value);
                                setIsOpen(false);
                            }}
                            className={`w-full px-4 py-3 text-sm text-left flex items-center space-x-3 hover:bg-purple-700/50 transition-all duration-200 border-b border-purple-500/10 last:border-b-0 ${option.value === value ? 'bg-blue-700/50 border-l-4 border-l-green-400' : ''
                                }`}
                        >
                            <div className={option.value === value ? 'text-green-400' : 'text-purple-300'}>
                                {option.icon}
                            </div>
                            <span className={option.value === value ? 'text-white font-bold' : 'text-blue-200'}>
                                {option.label}
                            </span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};