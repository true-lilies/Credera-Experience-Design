const Svg = ({ size, children, ...rest }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    aria-hidden="true"
    {...rest}
  >
    {children}
  </svg>
);

// Outline icon wrapper
const Line = ({ size, children }) => (
  <Svg
    size={size}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.9"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {children}
  </Svg>
);

/* ---------- General ---------- */

export const StarIcon = ({ filled = true, size = 16 }) => (
  <Svg size={size}>
    <path
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
      d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
    />
  </Svg>
);

export const ChevronIcon = ({ size = 20 }) => (
  <Svg size={size}>
    <path
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 9l6 6 6-6"
    />
  </Svg>
);

export const SearchIcon = ({ size = 18 }) => (
  <Svg size={size}>
    <path
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      d="M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zm9 16l-4-4"
    />
  </Svg>
);

export const ClearIcon = ({ size = 16 }) => (
  <Svg size={size}>
    <path
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      d="M6 6l12 12M18 6L6 18"
    />
  </Svg>
);

/* ---------- Navigation ---------- */

export const HomeIcon = ({ size = 20 }) => (
  <Line size={size}>
    <path d="M3 11l9-8 9 8" />
    <path d="M5 10v10h5v-6h4v6h5V10" />
  </Line>
);

export const UserIcon = ({ size = 20 }) => (
  <Line size={size}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
  </Line>
);

export const UsersIcon = ({ size = 20 }) => (
  <Line size={size}>
    <circle cx="9" cy="8" r="3.5" />
    <path d="M2.5 20c0-3.5 3-5.5 6.5-5.5s6.5 2 6.5 5.5" />
    <circle cx="17" cy="9" r="2.5" />
    <path d="M17 14.5c3 0 4.5 1.8 4.5 4.5" />
  </Line>
);

export const GroupsIcon = ({ size = 20 }) => (
  <Line size={size}>
    <rect x="3" y="3" width="7" height="7" rx="2" />
    <rect x="14" y="3" width="7" height="7" rx="2" />
    <rect x="3" y="14" width="7" height="7" rx="2" />
    <rect x="14" y="14" width="7" height="7" rx="2" />
  </Line>
);

export const MessageIcon = ({ size = 20 }) => (
  <Line size={size}>
    <path d="M4 5h16v11H9l-5 4V5z" />
  </Line>
);

export const SettingsIcon = ({ size = 20 }) => (
  <Line size={size}>
    <path d="M4 7h10M18 7h2M4 17h2M10 17h10" />
    <circle cx="16" cy="7" r="2" />
    <circle cx="8" cy="17" r="2" />
  </Line>
);

export const MenuIcon = ({ size = 22 }) => (
  <Line size={size}>
    <path d="M4 6h16M4 12h16M4 18h16" />
  </Line>
);

export const SunIcon = ({ size = 18 }) => (
  <Line size={size}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </Line>
);

export const MoonIcon = ({ size = 18 }) => (
  <Line size={size}>
    <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
  </Line>
);

/* ---------- Composer ---------- */

export const PhotoIcon = ({ size = 20 }) => (
  <Line size={size}>
    <rect x="3" y="4" width="18" height="16" rx="3" />
    <circle cx="9" cy="10" r="1.8" />
    <path d="M3 17l5-5 4 4 3-3 6 6" />
  </Line>
);

export const GifIcon = ({ size = 20 }) => (
  <Line size={size}>
    <rect x="3" y="6" width="18" height="12" rx="3" />
    <text
      x="12"
      y="15"
      textAnchor="middle"
      fontSize="7"
      fontWeight="700"
      fill="currentColor"
      stroke="none"
    >
      GIF
    </text>
  </Line>
);

export const SmileIcon = ({ size = 20 }) => (
  <Line size={size}>
    <circle cx="12" cy="12" r="9" />
    <path d="M8 14c1 1.5 2.3 2.2 4 2.2s3-.7 4-2.2" />
    <circle cx="9" cy="10" r=".8" fill="currentColor" />
    <circle cx="15" cy="10" r=".8" fill="currentColor" />
  </Line>
);

export const CalendarIcon = ({ size = 20 }) => (
  <Line size={size}>
    <rect x="3" y="5" width="18" height="16" rx="3" />
    <path d="M3 10h18M8 3v4M16 3v4" />
  </Line>
);

/* ---------- Group activity levels (tile icons, used later) ---------- */

export const LevelIcon = ({ level, size = 22 }) => {
  switch (level) {
    case 'favorites':
      return <StarIcon size={size} />;
    case 'active':
      return (
        <Svg size={size}>
          <circle cx="12" cy="12" r="4.5" fill="currentColor" />
          <circle
            cx="12"
            cy="12"
            r="9"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            opacity=".45"
          />
        </Svg>
      );
    case 'moderate':
      return (
        <Svg size={size}>
          <circle
            cx="12"
            cy="12"
            r="8.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path d="M12 3.5a8.5 8.5 0 0 1 0 17z" fill="currentColor" />
        </Svg>
      );
    case 'low':
      return (
        <Svg size={size}>
          <circle
            cx="12"
            cy="12"
            r="8.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path d="M12 12V3.5a8.5 8.5 0 0 1 8.5 8.5z" fill="currentColor" />
        </Svg>
      );
    default:
      return (
        <Svg size={size}>
          <circle
            cx="12"
            cy="12"
            r="8.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray="3 3"
          />
        </Svg>
      );
  }
};