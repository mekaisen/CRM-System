import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router';
import '@ant-design/v5-patch-for-react-19';

import { router } from './App.tsx';

import './index.css';

createRoot(document.getElementById('root')!).render(<RouterProvider router={router} />);
