import {
  useEffect,
  useState
} from 'react';

import AppLayout from './components/layout/AppLayout';

const THEME_KEY =
  'gpt-dual-calendar-theme';

export default function App() {
  const [
    theme,
    setTheme
  ] = useState(
    () =>
      localStorage.getItem(
        THEME_KEY
      ) || 'light'
  );

  useEffect(() => {
    document.documentElement.dataset.theme =
      theme;

    localStorage.setItem(
      THEME_KEY,
      theme
    );
  }, [theme]);

  const toggleTheme = () => {
    setTheme(
      current =>
        current === 'light'
          ? 'dark'
          : 'light'
    );
  };

  return (
    <AppLayout
      theme={theme}
      onToggleTheme={toggleTheme}
    />
  );
}
