import { Button } from 'antd';
import { useState } from 'react';

import type { TodoFilters, TodoInfo } from '@/types/todos.ts';

import styles from '@/pages/Todos/todo.module.css';

interface TodoFiltersProps {
  todosInfo: TodoInfo;
  onChange: (status: TodoFilters) => void;
}

export const TodosFilters = ({ onChange, todosInfo }: TodoFiltersProps) => {
  const [currentActive, setCurrentActive] = useState<TodoFilters>('all');

  const onChangeFilter = (filter: TodoFilters) => {
    onChange(filter);
    setCurrentActive(filter);
  };

  return (
    <div className={styles.filters}>
      <Button
        htmlType='button'
        size='middle'
        variant={`${currentActive === 'all' ? 'outlined' : 'text'}`}
        color={'primary'}
        onClick={() => onChangeFilter('all')}
      >
        Все ({todosInfo?.all})
      </Button>
      <Button
        htmlType='button'
        size='middle'
        variant={`${currentActive === 'inWork' ? 'outlined' : 'text'}`}
        color={'primary'}
        onClick={() => onChangeFilter('inWork')}
      >
        В работе ({todosInfo?.inWork})
      </Button>
      <Button
        htmlType='button'
        size='middle'
        variant={`${currentActive === 'completed' ? 'outlined' : 'text'}`}
        color={'primary'}
        onClick={() => onChangeFilter('completed')}
      >
        Сделано ({todosInfo?.completed})
      </Button>
    </div>
  );
};
