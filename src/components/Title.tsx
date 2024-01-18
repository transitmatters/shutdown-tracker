import { useStore } from '../store';

const Title = () => {
  const { darkMode } = useStore();

  return (
    <div className="flex flex-col">
      <div className="text-4xl md:text-7xl lg:text-8xl font-bold dark:text-white">
        MBTA Shutdown Tracker
      </div>
      <div className="flex flex-row items-center">
        <div className="text-md dark:text-white">by</div>
        <a href="https://transitmatters.org">
          <div className="w-32 md:w-40 lg:w-52 pl-1 md:pl-2">
            <img src={darkMode ? 'TMLogo.png' : 'Logo_wordmark.png'}></img>
          </div>
        </a>
      </div>
    </div>
  );
};

export default Title;
