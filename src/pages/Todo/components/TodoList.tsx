import { useState } from 'react';

import { IconEdit } from '@/components/icons/IconEdit';
import { IconTrash } from '@/components/icons/IconTrash';
import { deleteTodo, putTodo } from '@/helpers/api/requests/todos';

import styles from './todoList.module.css';
interface TodoListProps {
  allTodos: Todo[];
  className?: string;
  todosInfo: TodoInfo;
  setAllTodos: (value: React.SetStateAction<Todo[]>) => void;
  setTodosInfo: (value: React.SetStateAction<TodoInfo>) => void;
}

export const TodoList = ({ todosInfo, allTodos, className, setAllTodos }: TodoListProps) => {
  const [todoEditTitle, setTodoEditTitle] = useState('');
  const [currentEditTodo, setCurrentEditTodo] = useState<Todo | null>(null);

  return (
    <div className={className}>
      <div>
        <div>Все ({todosInfo?.all})</div>
        <div>В работе ({todosInfo?.inWork})</div>
        <div>Сделано ({todosInfo?.completed})</div>
      </div>
      <ul>
        {allTodos.map((todo) => {
          return (
            <li key={todo.id}>
              <div>
                <input id={todo.id.toString()} type='checkbox' />
                {todo.id === currentEditTodo?.id ? (
                  <input
                    type='text'
                    value={todoEditTitle}
                    onChange={(e) => {
                      setTodoEditTitle(e.target.value);
                    }}
                  />
                ) : (
                  <label htmlFor={todo.id.toString()}>{todo.title}</label>
                )}
              </div>
              {todo.id !== currentEditTodo?.id ? (
                <div className={styles.flex}>
                  <button
                    type='button'
                    onClick={() => {
                      setCurrentEditTodo(todo);
                      setTodoEditTitle(todo.title);
                    }}
                  >
                    <IconEdit color='red' />
                  </button>

                  <button
                    type='button'
                    onClick={async () => {
                      const indexDeleteTodo = allTodos.findIndex((t) => t.id === todo.id);
                      const deletedTodo = allTodos[indexDeleteTodo];
                      setAllTodos((prev) => prev.filter((t) => todo.id !== t.id));
                      try {
                        await deleteTodo(todo.id);
                      } catch (error) {
                        console.log(error);
                        setAllTodos((prev) => {
                          const todos = [...prev];
                          todos.splice(indexDeleteTodo, 0, deletedTodo);
                          return todos;
                        });
                      }

                      // await fetchAllTodoAndSave();
                    }}
                  >
                    <IconTrash />
                  </button>
                </div>
              ) : (
                <div className={styles.flex}>
                  <button
                    type='button'
                    onClick={async () => {
                      const currentEditTodoId = currentEditTodo?.id;
                      setCurrentEditTodo(null);
                      setAllTodos((prev) =>
                        prev.map((todo) =>
                          todo.id === currentEditTodoId ? { ...todo, title: todoEditTitle } : todo
                        )
                      );
                      try {
                        const serverTodo = await putTodo(
                          { isDone: todo.isDone, title: todoEditTitle },
                          todo.id
                        );
                        if (serverTodo) {
                          console.log('true');
                          setAllTodos((prev) =>
                            prev.map((todo) => (todo.id === currentEditTodoId ? serverTodo : todo))
                          );
                        }
                      } catch (error) {
                        console.log(error);
                        setAllTodos((prev) => prev.filter((todo) => todo.id !== currentEditTodoId));
                      }
                    }}
                  >
                    сохранить
                  </button>

                  <button
                    type='button'
                    onClick={async () => {
                      setCurrentEditTodo(null);
                    }}
                  >
                    отменить
                  </button>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};
