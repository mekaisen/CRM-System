import { useEffect, useState } from 'react';

import { deleteTodo, getTodos, postTodo, putTodo } from '@/helpers/api/requests/todos';

import { IconEdit } from '../../components/icons/IconEdit';
import { IconTrash } from '../../components/icons/IconTrash';

import styles from './todo.module.css';

export const Todo = () => {
  const [todoTitle, setTodoTitle] = useState('');
  const [todoEditTitle, setTodoEditTitle] = useState('');
  const [currentEditTodo, setCurrentEditTodo] = useState<Todo | null>(null);
  const [allTodos, setAllTodos] = useState<Todo[]>([]);
  const [todosInfo, setTodosInfo] = useState<TodoInfo>();
  const fetchAllTodoAndSave = async () => {
    const res = await getTodos('all');
    setTodosInfo(res.info);
    setAllTodos(res.data);
  };
  useEffect(() => {
    fetchAllTodoAndSave();
  }, []);

  return (
    <>
      <div>
        <input
          type='text'
          value={todoTitle}
          onChange={(e) => {
            setTodoTitle(e.target.value);
          }}
          placeholder='Task To Be Done...'
        />
        <button
          type='button'
          onClick={async () => {
            setTodoTitle('');
            await postTodo({ isDone: false, title: todoTitle });
            await fetchAllTodoAndSave();
          }}
        >
          Add
        </button>
      </div>
      <div>
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
                <div className={styles.flex}>
                  {todo.id === currentEditTodo?.id ? (
                    <button
                      type='button'
                      onClick={async () => {
                        setCurrentEditTodo(null);

                        await putTodo({ isDone: todo.isDone, title: todoEditTitle }, todo.id);
                        await fetchAllTodoAndSave();
                      }}
                    >
                      <IconEdit color='red' />
                    </button>
                  ) : (
                    <button
                      type='button'
                      onClick={() => {
                        setCurrentEditTodo(todo);
                        setTodoEditTitle(todo.title);
                      }}
                    >
                      <IconEdit color='red' />
                    </button>
                  )}
                  <button
                    type='button'
                    onClick={async () => {
                      await deleteTodo(todo.id);
                      await fetchAllTodoAndSave();
                    }}
                  >
                    <IconTrash />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
};
