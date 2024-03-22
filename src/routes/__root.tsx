import { createRootRoute, Link, Outlet } from '@tanstack/react-router';
import Navbar from '../components/Navbar';

export const Route = createRootRoute({
  component: () => <Navbar />,
});

// <>
//   <div className="p-2 flex gap-2">
//     <Link to="/" className="[&.active]:font-bold">
//       Home
//     </Link>{' '}
//     <Link to="/line" className="[&.active]:font-bold">
//       Line
//     </Link>
//   </div>
//   <hr />
//   <Outlet />
// </>
//   ),
// });
