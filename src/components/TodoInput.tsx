import { useState } from 'react';

import { postTodo } from '@/api/todos.ts';
import { Button } from '@/components/ui/Button.tsx';
import { validateTitle } from '@/helpers/utils/validateTitle.ts';

import styles from '@/pages/Todos/todo.module.css';

interface TodoInputProps {
  className?: string;
  getFilteredTodos: () => Promise<void>;
}

export const TodoInput = ({ className, getFilteredTodos }: TodoInputProps) => {
  const [todoTitle, setTodoTitle] = useState('');
  const [todoTitleError, setTodoTitleError] = useState('');

  const onAddTodo = async () => {
    const error = validateTitle(todoTitle);

    if (error) {
      setTodoTitleError(error);
      return;
    }

    try {
      const serverTodo = await postTodo({ isDone: false, title: todoTitle });

      if (serverTodo) {
        await getFilteredTodos();
      }

      setTodoTitle('');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <form
        className={`${className} ${styles.addTodo}`}
        onSubmit={async (e) => {
          e.preventDefault();
          onAddTodo();
        }}
      >
        <div className={styles.input}>
          <input
            type='text'
            value={todoTitle}
            onChange={(e) => {
              const value = e.target.value;
              setTodoTitle(value);
              setTodoTitleError(validateTitle(value));
            }}
            placeholder='Task To Be Done...'
          />
        </div>

        <Button
          className={`${styles.add} ${styles.button_blue}`}
          size={'large'}
          type='submit'
          color={'primary'}
        >
          Add
        </Button>
      </form>
      {!!todoTitleError && <span className='error_message'>{todoTitleError}</span>}
    </>
  );
};
