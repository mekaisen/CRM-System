import { useState } from 'react';

import type { Todo, TodoRequest } from '@/types/todos.ts';

import { deleteTodo, putTodo } from '@/api/todos.ts';
import { IconCancel } from '@/assets/icons/IconCancel.tsx';
import { IconEdit } from '@/assets/icons/IconEdit.tsx';
import { IconSave } from '@/assets/icons/IconSave.tsx';
import { IconTrash } from '@/assets/icons/IconTrash.tsx';
import { Button } from '@/components/ui/Button.tsx';
import { validateTitle } from '@/helpers/utils/validateTitle.ts';

import styles from '@/pages/Todos/todo.module.css';

interface TodoItemProps {
  className?: string;
  todo: Todo;
  onUpdateTodo: () => Promise<void>;
}

export const TodoItem = ({ todo, className, onUpdateTodo }: TodoItemProps) => {
  const [todoEditTitle, setTodoEditTitle] = useState<string>('');
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [todoEditTitleError, setTodoEditTitleError] = useState<string>('');

  const changeTodo = async ({ isDone, title }: TodoRequest) => {
    try {
      const serverTodo = await putTodo({ isDone, title }, todo.id);

      if (serverTodo) {
        onUpdateTodo();
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
        onUpdateTodo();
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

    changeTodo({ title });
  };

  const onChangeIsDone = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isDone = e.target.checked;

    changeTodo({ isDone });
  };
  const onChangeTitle = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTodoEditTitleError(validateTitle(e.target.value));
    setTodoEditTitle(e.target.value);
  };

  const onSaveTodo = () => {
    saveTodo(todoEditTitle);
  };
  const onCancelSave = () => {
    setIsEdit(false);
    setTodoEditTitleError('');
  };
  const onEdit = () => {
    setIsEdit(true);
    setTodoEditTitle(todo.title);
  };
  const onDelete = () => {
    removeTodo(todo);
  };
  return (
    <>
      <li className={className}>
        <div className={styles.title}>
          <input
            checked={todo.isDone}
            id={todo.id.toString()}
            type='checkbox'
            onChange={onChangeIsDone}
          />
          {isEdit ? (
            <form className={styles.title} onSubmit={onSaveTodo}>
              {' '}
              <textarea
                className={styles.title_input}
                id='inputTitle'
                value={todoEditTitle}
                onChange={onChangeTitle}
              />
              <div className={styles.flex}>
                <Button
                  className={styles.button_black}
                  size={'small'}
                  type='submit'
                  variant='classic'
                  color={'primary'}
                >
                  <IconSave className={styles.svg} />
                </Button>

                <Button
                  size='small'
                  type='button'
                  variant='classic'
                  color={'dangerous'}
                  onClick={onCancelSave}
                >
                  <IconCancel className={styles.svg} />
                </Button>
              </div>
            </form>
          ) : (
            <>
              <label
                className={`${todo.isDone && styles.title_line} ${styles.title_text}`}
                htmlFor={todo.id.toString()}
              >
                {todo.title}
              </label>
              <div className={styles.flex}>
                <Button
                  className={`${styles.edit_button} ${styles.button_blue}`}
                  size={'small'}
                  type='button'
                  color={'primary'}
                  onClick={onEdit}
                >
                  <IconEdit className={styles.svg} />
                </Button>

                <Button
                  className={`${styles.edit_button} ${styles.button_red}`}
                  size={'small'}
                  type='button'
                  color={'dangerous'}
                  onClick={onDelete}
                >
                  <IconTrash className={styles.svg} />
                </Button>
              </div>
            </>
          )}
        </div>
      </li>
      {!!todoEditTitleError && (
        <label className='absolute error_message' htmlFor='inputTitle'>
          {todoEditTitleError}
        </label>
      )}
    </>
  );
};
