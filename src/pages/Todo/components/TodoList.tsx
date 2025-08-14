import { useState } from 'react';

import { Button } from '@/components/ui/Button';
import { getTodos } from '@/helpers/api/requests/todos';

import { TodoItem } from './TodoItem';

import styles from '../todo.module.css';
interface TodoListProps {
  allTodos: Todo[];
  className?: string;
  todosInfo: TodoInfo;
  setAllTodos: (value: React.SetStateAction<Todo[]>) => void;
  setTodosInfo: (value: React.SetStateAction<TodoInfo>) => void;
}

export const TodoList = ({
  todosInfo,
  allTodos,
  className,
  setAllTodos,
  setTodosInfo
}: TodoListProps) => {
  const [todosFilter, setTodosFilter] = useState<'all' | 'completed' | 'inWork'>('all');
  return (
    <div className={className}>
      <div className={styles.filters}>
        <Button
          className={styles.filter_button}
          type='button'
          variant='underline'
          onClick={async () => {
            setAllTodos((await getTodos('all')).data);
            setTodosFilter('all');
          }}
        >
          Все ({todosInfo?.all})
        </Button>
        <Button
          className={styles.filter_button}
          type='button'
          variant='underline'
          onClick={async () => {
            setAllTodos((await getTodos('inWork')).data);
            setTodosFilter('inWork');
          }}
        >
          В работе ({todosInfo?.inWork})
        </Button>
        <Button
          className={styles.filter_button}
          type='button'
          variant='underline'
          onClick={async () => {
            setAllTodos((await getTodos('completed')).data);
            setTodosFilter('completed');
          }}
        >
          Сделано ({todosInfo?.completed})
        </Button>
      </div>

      <ul className={styles.todos}>
        {allTodos.map((todo) => {
          return (
            <TodoItem
              key={todo.id}
              className={styles.todo}
              allTodos={allTodos}
              setAllTodos={setAllTodos}
              setTodosInfo={setTodosInfo}
              todo={todo}
              todosFilter={todosFilter}
              todosInfo={todosInfo}
            />
          );
        })}
      </ul>
    </div>
  );
};
