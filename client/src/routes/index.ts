import { createBrowserRouter } from 'react-router-dom';

import ErrorBoundary from './ErrorBoundary.tsx';
import publicRoutes from './publicRoutes.ts';
import Suspense from './Suspense.tsx';

const router = createBrowserRouter([
  {
    Component: Suspense,
    ErrorBoundary,
    children: [publicRoutes],
  },
]);

export default router;
