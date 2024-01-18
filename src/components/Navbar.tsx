import Title from './Title';
import ThemeSwitcher from './ThemeSwitcher';
import { LineButtons } from './LineButtons';

const Navbar = () => {
  return (
    <div className="md:px-12 md:pt-12  pt-6 px-8 pb-6 bg-white dark:bg-slate-700 shadow">
      <div className="flex flex-row justify-between">
        <>
          <Title />
          <div className="flex items-center pt-1 md:pt-3 ">
            <div className="w-full border-2 border-black" />
          </div>
        </>
        <ThemeSwitcher />
      </div>
      <LineButtons />
    </div>
  );
};

export default Navbar;
