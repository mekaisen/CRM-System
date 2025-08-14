import { useState } from 'react';

import { getTodos, postTodo } from '@/helpers/api/requests/todos';

interface TodoInputProps {
  className?: string;
  setAllTodos: (value: React.SetStateAction<Todo[]>) => void;
  setTodosInfo: (value: React.SetStateAction<TodoInfo>) => void;
}

export const TodoInput = ({ setAllTodos, setTodosInfo, className }: TodoInputProps) => {
  const [todoTitle, setTodoTitle] = useState('');
  return (
    <div className={className}>
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
              console.log('true');
              setAllTodos((prev) => prev.map((todo) => (todo.id === newId ? serverTodo : todo)));
              setTodosInfo(serverInfo);
            }
          } catch (error) {
            console.log(error);
            setAllTodos((prev) => prev.filter((todo) => todo.id !== newId));
          }
        }}
      >
        Add
      </button>
    </div>
  );
};
