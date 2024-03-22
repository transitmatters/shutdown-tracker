import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/line')({
  component: () => <div>Hello /line!</div>,
});
