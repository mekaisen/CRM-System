import { useState } from 'react';

import type { Todo } from '@/types/todos.ts';

import { IconEdit } from '@/assets/icons/IconEdit.tsx';
import { IconTrash } from '@/assets/icons/IconTrash.tsx';
import { Button } from '@/components/ui/Button.tsx';
import { deleteTodo, putTodo } from '@/helpers/api/requests/todos';
import { validateTitle } from '@/helpers/utils/validateTitle.ts';

import styles from '@/pages/Todos/todo.module.css';

interface TodoItemProps {
  className?: string;
  todo: Todo;
  getFilteredTodos: () => Promise<void>;
}

export const TodoItem = ({ todo, className, getFilteredTodos }: TodoItemProps) => {
  const [todoEditTitle, setTodoEditTitle] = useState<string>('');
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [todoEditTitleError, setTodoEditTitleError] = useState<string>('');

  const changeTodo = async (isDone?: boolean, title?: string) => {
    try {
      const serverTodo = await putTodo({ isDone, title }, todo.id);

      if (serverTodo) {
        getFilteredTodos();
      }
    } catch (error) {
      if (!(error instanceof Error)) return;

      console.error(error);
    }
  };

  const removeTodo = async (todo: Todo) => {
    try {
      const serverTodo = await deleteTodo(todo.id);

      if (serverTodo.ok) {
        getFilteredTodos();
      }
    } catch (error) {
      console.error(error);
    }
  };
  const saveTodo = (title: string) => {
    const error = validateTitle(title);

    if (error) {
      setTodoEditTitleError(error);
      return;
    }

    setIsEdit(false);

    changeTodo(undefined, title);
  };
  return (
    <>
      <li className={className}>
        <div className={styles.title}>
          <input
            checked={todo.isDone}
            id={todo.id.toString()}
            type='checkbox'
            onChange={(e) => {
              const isChecked = e.target.checked;

              changeTodo(isChecked, undefined);
            }}
          />
          {isEdit ? (
            <>
              <textarea
                className={styles.title_input}
                value={todoEditTitle}
                onChange={(e) => {
                  setTodoEditTitleError(validateTitle(e.target.value));
                  setTodoEditTitle(e.target.value);
                }}
              />
            </>
          ) : (
            <label
              className={`${todo.isDone && styles.title_line} ${styles.title_text}`}
              htmlFor={todo.id.toString()}
            >
              {todo.title}
            </label>
          )}
        </div>
        {isEdit ? (
          <div className={styles.flex}>
            <Button
              className={styles.button_black}
              size={'medium'}
              type='button'
              variant='classic'
              color={'primary'}
              onClick={() => saveTodo(todoEditTitle)}
            >
              сохранить
            </Button>

            <Button
              size={'medium'}
              type='button'
              variant='classic'
              color={'primary'}
              onClick={async () => {
                setIsEdit(false);
                setTodoEditTitleError('');
              }}
            >
              отменить
            </Button>
          </div>
        ) : (
          <div className={styles.flex}>
            <Button
              className={`${styles.edit_button} ${styles.button_blue}`}
              size={'small'}
              type='button'
              color={'primary'}
              onClick={() => {
                setIsEdit(true);
                setTodoEditTitle(todo.title);
              }}
            >
              <IconEdit className={styles.svg} />
            </Button>

            <Button
              className={`${styles.edit_button} ${styles.button_red}`}
              size={'small'}
              type='button'
              color={'dangerous'}
              onClick={async () => {
                removeTodo(todo);
              }}
            >
              <IconTrash className={styles.svg} />
            </Button>
          </div>
        )}
      </li>
      {!!todoEditTitleError && <div className='absolute error_message'>{todoEditTitleError}</div>}
    </>
  );
};
