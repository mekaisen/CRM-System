import { createBrowserRouter } from 'react-router';

import { TodosPage } from '@/pages/Todos/TodosPage.tsx';

import './App.css';

const App = () => {
  return (
    <>
      <TodosPage />
    </>
  );
};

export const router = createBrowserRouter([
  {
    path: '/',
    Component: App
  }
]);

export default App;
