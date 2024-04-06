import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: () => <></>,
  loader: async () => {
    throw redirect({ to: '/home' });
  },
});
