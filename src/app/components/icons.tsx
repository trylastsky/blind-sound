export const SoundWavesIcon = ({ className = "", ...props }) => (
  <svg 
    width="40" 
    height="40" 
    viewBox="0 0 40 40" 
    fill="none"
    className={className}
    {...props}
  >
    <path 
      d="M10 25L10 15M15 28L15 12M20 24L20 16M25 26L25 14M30 22L30 18" 
      stroke="url(#soundGradient)" 
      strokeWidth="3" 
      strokeLinecap="round"
    />
    <defs>
      <linearGradient id="soundGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#3B82F6"/>
        <stop offset="50%" stopColor="#7C3AED"/>
        <stop offset="100%" stopColor="#EC4899"/>
      </linearGradient>
    </defs>
  </svg>
);