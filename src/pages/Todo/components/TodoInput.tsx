import { useState } from 'react';

import { Button } from '@/components/ui/Button';
import { getTodos, postTodo } from '@/helpers/api/requests/todos';
import { validateTitle } from '@/helpers/utils/validateTitle';

import styles from '../todo.module.css';

interface TodoInputProps {
  className?: string;
  setAllTodos: (value: React.SetStateAction<Todo[]>) => void;
  setTodosInfo: (value: React.SetStateAction<TodoInfo>) => void;
}

export const TodoInput = ({ setAllTodos, setTodosInfo, className }: TodoInputProps) => {
  const [todoTitle, setTodoTitle] = useState('');
  const [todoTitleError, setTodoTitleError] = useState('');

  return (
    <>
      <div className={`${className} ${styles.addTodo}`}>
        <div className={styles.input}>
          <input
            type='text'
            value={todoTitle}
            onChange={(e) => {
              setTodoTitleError(validateTitle(todoTitle));

              setTodoTitle(e.target.value);
            }}
            placeholder='Task To Be Done...'
          />
        </div>

        <Button
          className={`${styles.add} ${styles.button_blue}`}
          type='button'
          onClick={async () => {
            const error = validateTitle(todoTitle);
            if (error) {
              setTodoTitleError(error);
              return;
            }
            setTodoTitle('');
            const newId = +(Math.random() * 100).toFixed();
            setAllTodos((prev) => [
              ...prev,
              {
                title: todoTitle,
                isDone: false,
                created: new Date().toDateString(),
                id: newId
              }
            ]);
            setTodosInfo((prev) => {
              return { ...prev, all: prev.all + 1, inWork: prev.inWork + 1 };
            });
            try {
              const serverTodo = await postTodo({ isDone: false, title: todoTitle });
              const serverInfo = (await getTodos('all')).info;
              if (serverTodo && serverInfo) {
                setAllTodos((prev) => prev.map((todo) => (todo.id === newId ? serverTodo : todo)));
                setTodosInfo(serverInfo);
              }
            } catch (error) {
              console.error(error);
              setAllTodos((prev) => prev.filter((todo) => todo.id !== newId));
            }
          }}
        >
          Add
        </Button>
      </div>
      {!!todoTitleError && <span className='error_message'>{todoTitleError}</span>}
    </>
  );
};
