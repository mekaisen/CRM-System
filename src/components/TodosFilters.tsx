import { useState } from 'react';

import type { TodoFilters } from '@/api/todos.ts';
import type { TodoInfo } from '@/types/todos.ts';

import { Button } from '@/components/ui/Button.tsx';

import styles from '@/pages/Todos/todo.module.css';

interface TodoFiltersProps {
  todosInfo: TodoInfo;
  onChangeFilter: (status: TodoFilters) => void;
}

export const TodosFilters = ({ onChangeFilter, todosInfo }: TodoFiltersProps) => {
  const [currentActive, setCurrentActive] = useState<TodoFilters>('all');
  return (
    <div className={styles.filters}>
      <Button
        active={currentActive === 'all'}
        className={styles.filter_button}
        size={'medium'}
        type='button'
        variant='underline'
        color={'primary'}
        onClick={() => {
          onChangeFilter('all');
          setCurrentActive('all');
        }}
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
        onClick={() => {
          onChangeFilter('inWork');
          setCurrentActive('inWork');
        }}
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
        onClick={() => {
          onChangeFilter('completed');
          setCurrentActive('completed');
        }}
      >
        Сделано ({todosInfo?.completed})
      </Button>
    </div>
  );
};
