import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons';

const Footer = () => {
  return (
    <div className="flex flex-row mb-2 items-center justify-center divide-x">
      <a
        className="text-sm dark:text-white px-2 hover:underline cursor-pointer"
        href="https://transitmatters.org/transitmatters-labs"
        target="_blank"
      >
        About
      </a>
      <a
        className="text-sm dark:text-white px-2 hover:underline cursor-pointer"
        href="https://transitmatters.org/join"
        target="_blank"
      >
        Join
      </a>
      <a
        className="text-sm group dark:text-white px-2 hover:underline cursor-pointer hover:text-tm-red"
        href="https://transitmatters.org/donate"
        target="_blank"
        title={'Support our work, Donate'}
      >
        <FontAwesomeIcon icon={faHeartSolid} size="sm" className="group-hover:text-tm-red" /> Donate
      </a>
      <a
        className="text-sm dark:text-white px-2 hover:underline cursor-pointer"
        href="https://github.com/transitmatters/shutdown-tracker"
        target="_blank"
      >
        Source Code
      </a>
    </div>
  );
};

export default Footer;
