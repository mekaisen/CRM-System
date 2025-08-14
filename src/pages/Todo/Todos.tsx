import { useEffect, useState } from 'react';

import { getTodos } from '@/helpers/api/requests/todos';

import { TodoInput } from './components/TodoInput';
import { TodoList } from './components/TodoList';

export const Todos = () => {
  const [allTodos, setAllTodos] = useState<Todo[]>([]);
  const [todosInfo, setTodosInfo] = useState<TodoInfo>({ all: 0, completed: 0, inWork: 0 });

  useEffect(() => {
    const fetchAllTodoAndSave = async () => {
      const res = await getTodos('all');
      setTodosInfo(res.info ?? { all: 0, completed: 0, inWork: 0 });
      setAllTodos(res.data);
    };
    fetchAllTodoAndSave();
  }, []);

  return (
    <>
      <TodoInput setAllTodos={setAllTodos} setTodosInfo={setTodosInfo} />
      <TodoList
        allTodos={allTodos}
        setAllTodos={setAllTodos}
        setTodosInfo={setTodosInfo}
        todosInfo={todosInfo}
      />
    </>
  );
};
