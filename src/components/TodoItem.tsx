import type { CheckboxChangeEvent, FormProps } from 'antd';

import { Button, Checkbox, Form, Input } from 'antd';
import { useState } from 'react';

import type { Todo, TodoRequest } from '@/types/todos.ts';

import { deleteTodo, putTodo } from '@/api/todos.ts';
import { IconCancel } from '@/assets/icons/IconCancel.tsx';
import { IconEdit } from '@/assets/icons/IconEdit.tsx';
import { IconSave } from '@/assets/icons/IconSave.tsx';
import { IconTrash } from '@/assets/icons/IconTrash.tsx';
import { rulesTitle } from '@/helpers/validationRules.ts';

import styles from '@/pages/Todos/todo.module.css';

interface TodoItemProps {
  className?: string;
  todo: Todo;
  onUpdateTodo: () => Promise<void>;
}
interface FieldType {
  title: string;
}

export const TodoItem = ({ todo, className, onUpdateTodo }: TodoItemProps) => {
  const [isEdit, setIsEdit] = useState<boolean>(false);

  const changeTodo = async ({ isDone, title }: TodoRequest) => {
    try {
      await putTodo({ isDone, title }, todo.id);
      await onUpdateTodo();
    } catch (error) {
      if (!(error instanceof Error)) throw new Error('Ошибка изменения туду');

      console.error(error);
    }
  };
  const removeTodo = async (todo: Todo) => {
    try {
      await deleteTodo(todo.id);
      await onUpdateTodo();
    } catch (error) {
      if (!(error instanceof Error)) throw new Error('Ошибка удаления туду');

      console.error(error);
    }
  };

  const onChangeIsDone = (e: CheckboxChangeEvent) => {
    const isDone = e.target.checked;

    changeTodo({ isDone });
  };
  const onSaveTodo: FormProps<FieldType>['onFinish'] = (value) => {
    changeTodo({ title: value.title });

    setIsEdit(false);
  };
  const onCancelSave = () => {
    setIsEdit(false);
  };
  const onEdit = () => {
    setIsEdit(true);
  };
  const onDelete = () => {
    removeTodo(todo);
  };
  return (
    <>
      <li className={className}>
        <div className={styles.title}>
          <Checkbox
            checked={todo.isDone}
            id={`todo-input-title-${todo.id}`}
            type='checkbox'
            onChange={onChangeIsDone}
          />
          {isEdit ? (
            <Form className={styles.title} onFinish={onSaveTodo}>
              <Form.Item<FieldType>
                className={styles.input_value_edit}
                initialValue={todo.title}
                name='title'
                rules={rulesTitle}
              >
                <Input placeholder='Задача...' />
              </Form.Item>

              <div className={styles.flex}>
                <Button
                  htmlType='submit'
                  size='large'
                  variant='solid'
                  color='primary'
                  icon={<IconSave />}
                ></Button>
                <Button
                  htmlType='button'
                  size='large'
                  variant='solid'
                  color='danger'
                  icon={<IconCancel />}
                  onClick={onCancelSave}
                ></Button>
              </div>
            </Form>
          ) : (
            <>
              <label
                className={`${todo.isDone && styles.title_line} ${styles.title_text}`}
                htmlFor={`todo-input-title-${todo.id}`}
              >
                {todo.title}
              </label>
              <div className={styles.flex}>
                <Button
                  htmlType='button'
                  size='large'
                  variant='solid'
                  color={'primary'}
                  icon={<IconEdit />}
                  onClick={onEdit}
                ></Button>

                <Button
                  htmlType='button'
                  size='large'
                  variant='solid'
                  color='danger'
                  icon={<IconTrash />}
                  onClick={onDelete}
                ></Button>
              </div>
            </>
          )}
        </div>
      </li>
    </>
  );
};
