import { useState } from 'react';

import { postTodo } from '@/api/todos.ts';
import { Button } from '@/components/ui/Button.tsx';
import { validateTitle } from '@/helpers/utils/validateTitle.ts';

import styles from '@/pages/Todos/todo.module.css';

interface TodoInputProps {
  onUpdate: () => Promise<void>;
}

export const TodoInput = ({ onUpdate }: TodoInputProps) => {
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
        await onUpdate();
      }

      setTodoTitle('');
    } catch (error) {
      console.error(error);
    }
  };

  const onCreateTodo = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onAddTodo();
  };

  const onChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTodoTitle(value);
    setTodoTitleError(validateTitle(value));
  };
  return (
    <>
      <form className={`${styles.addTodo}`} onSubmit={onCreateTodo}>
        <div className={styles.input}>
          <input
            type='text'
            value={todoTitle}
            onChange={onChangeTitle}
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
