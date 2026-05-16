import { RouteObject } from 'react-router-dom';
import { lazy } from 'react';
import HomePage from './pages/index';
import TranslatePage from './pages/translate';
import MascotPage from './pages/mascot';
import DashboardPage from './pages/dashboard';
import ParentPage from './pages/parent';
import FeaturesPage from './pages/features';
import LanguagesPage from './pages/languages';
import PricingPage from './pages/pricing';
import AuthPage from './pages/auth/AuthPage';

// 404 routing by runtime:
// - DEV (preview container / local vite): dev-tools PageNotFound — development iframe vs standalone preview
// - PROD (publish build): pages/_404 — plain 404 for visitors
const NotFoundPage = import.meta.env.DEV
  ? lazy(() => import('../dev-tools/src/PageNotFound'))
  : lazy(() => import('./pages/_404'));

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/features',
    element: <FeaturesPage />,
  },
  {
    path: '/languages',
    element: <LanguagesPage />,
  },
  {
    path: '/pricing',
    element: <PricingPage />,
  },
  {
    path: '/auth',
    element: <AuthPage />,
  },
  {
    path: '/translate',
    element: <TranslatePage />,
  },
  {
    path: '/mascot',
    element: <MascotPage />,
  },
  {
    path: '/dashboard',
    element: <DashboardPage />,
  },
  {
    path: '/parent',
    element: <ParentPage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
];

// Types for type-safe navigation
export type Path = '/' | '/features' | '/languages' | '/pricing' | '/auth' | '/translate' | '/mascot' | '/dashboard' | '/parent';

export type Params = Record<string, string | undefined>;
