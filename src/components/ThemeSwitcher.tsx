import { useEffect } from 'react';
import { useStore } from '../store';
import { DarkModeSwitch } from 'react-toggle-dark-mode';

const ThemeSwitcher = () => {
  const { darkMode, setDarkMode } = useStore();

  console.log(darkMode);
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
