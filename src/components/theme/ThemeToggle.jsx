import { useTheme } from './useTheme';
import { MoonIcon, SunIcon } from '../icons';

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      className="theme-toggle"
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      onClick={toggleTheme}
    >
      <span className="theme-toggle-label">
        {isDark ? <MoonIcon size={18} /> : <SunIcon size={18} />}
        <span className="theme-toggle-text">Dark mode</span>
      </span>
      <span className="theme-toggle-track" aria-hidden="true">
        <span className="theme-toggle-thumb" />
      </span>
    </button>
  );
};