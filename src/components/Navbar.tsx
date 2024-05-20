import { ReactNode } from 'react';
import Title from './Title';
import ThemeSwitcher from './ThemeSwitcher';

const Navbar = ({ children }: { children?: ReactNode }) => {
  return (
    <div className="md:px-12 md:pt-12  pt-6 px-8 pb-4 md:pb-6 bg-white dark:bg-slate-700 shadow">
      <div className="flex flex-row justify-between">
        <Title />
        <ThemeSwitcher />
      </div>
      <div className="flex flex-col md:flex-row md:justify-between w-full">{children}</div>
    </div>
  );
};

export default Navbar;
