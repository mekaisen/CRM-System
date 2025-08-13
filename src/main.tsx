import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router';

import App from './App.tsx';

import './index.css';

const router = createBrowserRouter([
  {
    path: '/',
    Component: App
  }
]);

createRoot(document.getElementById('root')!).render(<RouterProvider router={router} />);
