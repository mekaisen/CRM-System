import { useState } from 'react';

import type { TodoFilters, TodoInfo } from '@/types/todos.ts';

import { Button } from '@/components/ui/Button.tsx';

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
        active={currentActive === 'all'}
        className={styles.filter_button}
        size={'medium'}
        type='button'
        variant='underline'
        color={'primary'}
        onClick={() => onChangeFilter('all')}
      >
        Все ({todosInfo?.all})
      </Button>
      <Button
        active={currentActive === 'inWork'}
        className={styles.filter_button}
        size={'medium'}
        type='button'
        variant='underline'
        color={'primary'}
        onClick={() => onChangeFilter('inWork')}
      >
        В работе ({todosInfo?.inWork})
      </Button>
      <Button
        active={currentActive === 'completed'}
        className={styles.filter_button}
        size={'medium'}
        type='button'
        variant='underline'
        color={'primary'}
        onClick={() => onChangeFilter('completed')}
      >
        Сделано ({todosInfo?.completed})
      </Button>
    </div>
  );
};
