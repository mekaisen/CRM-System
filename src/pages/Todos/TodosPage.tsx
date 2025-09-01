import { useEffect, useState } from 'react';

import type { Todo, TodoFilters, TodoInfo } from '@/types/todos.ts';

import { getTodos } from '@/api/todos.ts';
import { TodoInput } from '@/components/TodoInput.tsx';
import { TodoList } from '@/components/TodoList.tsx';
import { TodosFilters } from '@/components/TodosFilters.tsx';

export const TodosPage = () => {
  const [allTodos, setAllTodos] = useState<Todo[]>([]);
  const [todosInfo, setTodosInfo] = useState<TodoInfo>({ all: 0, completed: 0, inWork: 0 });
  const [todosFilter, setTodosFilter] = useState<TodoFilters>('all');

  const onChangeFilter = (filter: TodoFilters) => {
    setTodosFilter(filter);
  };

  const getFilteredTodos = () => {
    return getAllTodoAndSave(todosFilter);
  };

  const getAllTodoAndSave = async (filter: TodoFilters) => {
    try {
      const res = await getTodos(filter);

      setTodosInfo((prev) => {
        return res.info || prev;
      });
      setAllTodos(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAllTodoAndSave(todosFilter);

    const timer = setInterval(() => {
      getAllTodoAndSave(todosFilter);
    }, 5000);
    return () => clearInterval(timer);
  }, [todosFilter]);

  return (
    <>
      <TodoInput onUpdate={getFilteredTodos} />
      <TodosFilters onChange={onChangeFilter} todosInfo={todosInfo} />
      <TodoList onUpdate={getFilteredTodos} todos={allTodos} />
    </>
  );
};
