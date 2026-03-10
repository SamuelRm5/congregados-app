import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import PublicLayout from '../components/layout/PublicLayout';
import PrivateLayout from '../components/layout/PrivateLayout';
import ProtectedRoute from './ProtectedRoute';
import LoadingSpinner from '../components/ui/LoadingSpinner';

// Lazy-loaded pages
const PrayersPage = lazy(() => import('../pages/public/PrayersPage'));
const LoginPage = lazy(() => import('../pages/auth/LoginPage'));
const SongsListPage = lazy(() => import('../pages/songs/SongsListPage'));
const SongViewerPage = lazy(() => import('../pages/songs/SongViewerPage'));
const SongEditorPage = lazy(() => import('../pages/songs/SongEditorPage'));
const PresentationPage = lazy(() => import('../pages/songs/PresentationPage'));
const PrayersAdminPage = lazy(() => import('../pages/prayers/PrayersAdminPage'));

const Fallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <LoadingSpinner size="lg" />
  </div>
);

const withSuspense = (el: React.ReactElement) => (
  <Suspense fallback={<Fallback />}>{el}</Suspense>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true, element: <Navigate to="prayers" replace /> },
      { path: 'prayers', element: withSuspense(<PrayersPage />) },
      { path: 'login', element: withSuspense(<LoginPage />) },
    ],
  },
  {
    path: '/app',
    element: (
      <ProtectedRoute>
        <PrivateLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="songs" replace /> },
      { path: 'songs', element: withSuspense(<SongsListPage />) },
      { path: 'songs/new', element: withSuspense(<SongEditorPage />) },
      { path: 'songs/:id', element: withSuspense(<SongViewerPage />) },
      { path: 'songs/:id/edit', element: withSuspense(<SongEditorPage />) },
      { path: 'songs/:id/present', element: withSuspense(<PresentationPage />) },
      { path: 'prayers', element: withSuspense(<PrayersAdminPage />) },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
]);
