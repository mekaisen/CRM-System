import { useRef, useState } from 'react';

import { IconEdit } from '@/components/icons/IconEdit';
import { IconTrash } from '@/components/icons/IconTrash';
import { Button } from '@/components/ui/Button';
import { deleteTodo, getTodos, putTodo } from '@/helpers/api/requests/todos';
import { filterTodos } from '@/helpers/utils/filterTodos';
import { validateTitle } from '@/helpers/utils/validateTitle';

import styles from '../todo.module.css';
interface TodoItemProps {
  allTodos: Todo[];
  className?: string;
  todo: Todo;
  todosFilter: 'all' | 'completed' | 'inWork';
  todosInfo: TodoInfo;
  setAllTodos: (value: React.SetStateAction<Todo[]>) => void;
  setTodosInfo: (value: React.SetStateAction<TodoInfo>) => void;
}

export const TodoItem = ({
  todo,
  setAllTodos,
  setTodosInfo,
  allTodos,
  className,
  todosInfo,
  todosFilter
}: TodoItemProps) => {
  const [todoEditTitle, setTodoEditTitle] = useState('');
  const [isEdit, setIsEdit] = useState(false);
  const [todoEditTitleError, setTodoEditTitleError] = useState('');

  const controller = useRef<AbortController | null>(null);
  const initialTodos = useRef<Todo[]>(allTodos);
  const initialTodosInfo = useRef<TodoInfo>(todosInfo);
  const changeTodo = async (isDone: boolean, title: string, settings?: FetchConfig) => {
    try {
      await putTodo({ isDone, title }, todo.id, settings);
      const todos = await getTodos(todosFilter, settings);
      initialTodos.current = todos.data;
      setAllTodos(todos.data);
      setTodosInfo(todos.info as TodoInfo);
    } catch (error) {
      if (!(error instanceof Error)) return;
      if ('name' in error && error.name === 'AbortError') {
        return;
      }

      console.error(error);
      const todos = await getTodos(todosFilter, settings);
      if (todos) {
        const prevTodos = filterTodos(todos.data, todosFilter);
        setAllTodos(prevTodos);
        setTodosInfo(todos.info as TodoInfo);
      } else {
        const prevTodos = filterTodos(initialTodos.current, todosFilter);
        setAllTodos(prevTodos);

        setTodosInfo(initialTodosInfo.current);
      }
    }
  };
  const removeTodo = async (
    todo: Todo,
    indexDeleteTodo: number,
    deletedTodo: Todo,
    settings?: FetchConfig
  ) => {
    try {
      await deleteTodo(todo.id);
      const todos = await getTodos(todosFilter, settings);
      initialTodos.current = todos.data;
      setAllTodos(todos.data);
      setTodosInfo(todos.info as TodoInfo);
    } catch (error) {
      console.error(error);
      const todos = await getTodos(todosFilter, settings);
      if (todos) {
        const prevTodos = filterTodos(todos.data, todosFilter);
        setAllTodos(prevTodos);
        setTodosInfo(todos.info as TodoInfo);
      } else {
        setAllTodos((prev) => {
          const todos = [...prev];
          todos.splice(indexDeleteTodo, 0, deletedTodo);
          return todos;
        });
        setTodosInfo(initialTodosInfo.current);
      }
    }
  };
  return (
    <>
      <li className={className}>
        <div className={styles.title}>
          <input
            checked={todo.isDone}
            id={todo.id.toString()}
            type='checkbox'
            onChange={async (e) => {
              controller.current?.abort();
              controller.current = new AbortController();

              const isChecked = e.target.checked;

              setAllTodos((prev) =>
                filterTodos(
                  prev.map((t) => (todo.id === t.id ? { ...t, isDone: isChecked } : t)),
                  todosFilter
                )
              );

              setTodosInfo((prev) => {
                const newInfo = { ...prev };
                if (todo.isDone) {
                  newInfo.completed--;
                  newInfo.inWork++;
                } else {
                  newInfo.inWork--;
                  newInfo.completed++;
                }
                return newInfo;
              });
              changeTodo(isChecked, todo.title, { signal: controller.current.signal });
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
              type='button'
              variant='underline'
              onClick={async () => {
                const error = validateTitle(todoEditTitle);
                if (error) {
                  setTodoEditTitleError(error);
                  return;
                }
                const currentEditTodoId = todo?.id;
                setIsEdit(false);
                setAllTodos((prev) =>
                  prev.map((todo) =>
                    todo.id === currentEditTodoId ? { ...todo, title: todoEditTitle } : todo
                  )
                );
                changeTodo(todo.isDone, todoEditTitle);
              }}
            >
              сохранить
            </Button>

            <Button
              type='button'
              variant='underline'
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
              type='button'
              onClick={() => {
                setIsEdit(true);
                setTodoEditTitle(todo.title);
              }}
            >
              <IconEdit className={styles.svg} />
            </Button>

            <Button
              className={`${styles.edit_button} ${styles.button_red}`}
              type='button'
              onClick={async () => {
                const indexDeleteTodo = allTodos.findIndex((t) => t.id === todo.id);
                const deletedTodo = allTodos[indexDeleteTodo];
                setAllTodos((prev) => prev.filter((t) => todo.id !== t.id));

                setTodosInfo((prev) => {
                  const newInfo = { ...prev };
                  if (todo.isDone) {
                    newInfo.all--;
                    newInfo.completed--;
                  } else {
                    newInfo.all--;
                    newInfo.inWork--;
                  }
                  return newInfo;
                });
                removeTodo(todo, indexDeleteTodo, deletedTodo);
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
