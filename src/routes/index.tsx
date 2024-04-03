import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: () => <></>,
  loader: async ({ route, location }) => {
    console.log('Current Path:', location.pathname);
    if (location.pathname === '/') {
      throw redirect({ to: '/$line', params: { line: 'red' } });
    }
  },
});
