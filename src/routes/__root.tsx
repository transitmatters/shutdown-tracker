import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';

const ON_PROD = process.env.NODE_ENV === 'production';

export const Route = createRootRoute({
  component: () => (
    <>
      <Outlet />
      {!ON_PROD && <TanStackRouterDevtools />}
    </>
  ),
});
