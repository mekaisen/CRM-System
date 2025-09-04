import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import '@ant-design/v5-patch-for-react-19';
import { RouterProvider } from 'react-router';

import { store } from '@/store/store.ts';

import { router } from './App.tsx';

import './index.css';

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
