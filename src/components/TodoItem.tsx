import type { CheckboxChangeEvent, FormProps } from 'antd';
import type { Rule } from 'rc-field-form/lib/interface';

import { Button, Checkbox, Form, Input } from 'antd';
import { useState } from 'react';

import type { Todo, TodoRequest } from '@/types/todos.ts';

import { deleteTodo, putTodo } from '@/api/todos.ts';
import { IconCancel } from '@/assets/icons/IconCancel.tsx';
import { IconEdit } from '@/assets/icons/IconEdit.tsx';
import { IconSave } from '@/assets/icons/IconSave.tsx';
import { IconTrash } from '@/assets/icons/IconTrash.tsx';

import styles from '@/pages/Todos/todo.module.css';

interface TodoItemProps {
  className?: string;
  todo: Todo;
  onUpdateTodo: () => Promise<void>;
}
interface FieldType {
  title?: string;
}

const rulesTitle: Rule[] = [
  { required: true, message: 'Это поле не может быть пустым' },
  { type: 'string', min: 2, message: 'Минимальная длина текста 2 символа' },
  { type: 'string', max: 64, message: 'Максимальная длина текста 64 символа' }
];

export const TodoItem = ({ todo, className, onUpdateTodo }: TodoItemProps) => {
  const [todoEditTitle, setTodoEditTitle] = useState<string>('');
  const [isEdit, setIsEdit] = useState<boolean>(false);

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

      if (serverTodo.statusText === 'OK') {
        onUpdateTodo();
      }
    } catch (error) {
      console.error(error);
    }
  };
  const saveTodo = (title: string) => {
    setIsEdit(false);

    changeTodo({ title });
  };

  const onChangeIsDone = (e: CheckboxChangeEvent) => {
    const isDone = e.target.checked;

    changeTodo({ isDone });
  };
  const onSaveTodo: FormProps<FieldType>['onFinish'] = (value) => {
    if (!value.title) return;
    saveTodo(value.title);
    setTodoEditTitle(value.title);
  };
  const onCancelSave = () => {
    setIsEdit(false);
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
          <Checkbox
            checked={todo.isDone}
            id={todo.id.toString()}
            type='checkbox'
            onChange={onChangeIsDone}
          />
          {isEdit ? (
            <Form className={styles.title} onFinish={onSaveTodo}>
              <Form.Item<FieldType>
                className={styles.input_value_edit}
                initialValue={todoEditTitle}
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
                htmlFor={todo.id.toString()}
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
