import { useEffect } from 'react';
import { DarkModeSwitch } from 'react-toggle-dark-mode';
import { useStore } from '../store';

const ThemeSwitcher = () => {
  const { darkMode, setDarkMode } = useStore();

  useEffect(() => {
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDarkMode);
  }, [setDarkMode]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    if (darkMode !== undefined) {
      localStorage.setItem('darkMode', darkMode.toString());
    }
  }, [darkMode]);

  const toggleDarkMode = (checked: boolean) => {
    setDarkMode(checked);
  };

  return <DarkModeSwitch checked={darkMode!} onChange={toggleDarkMode} size={24} />;
};

export default ThemeSwitcher;
