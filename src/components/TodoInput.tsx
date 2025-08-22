import type { FormProps } from 'antd';
import type { Rule } from 'rc-field-form/lib/interface';

import { Button, Form, Input } from 'antd';
import { useState } from 'react';

import { postTodo } from '@/api/todos.ts';

import styles from '@/pages/Todos/todo.module.css';

interface TodoInputProps {
  onUpdate: () => Promise<void>;
}

interface FieldType {
  title?: string;
}

const rulesTitle: Rule[] = [
  { required: true, message: 'Это поле не может быть пустым' },
  { type: 'string', min: 2, message: 'Минимальная длина текста 2 символа' },
  { type: 'string', max: 64, message: 'Максимальная длина текста 64 символа' }
];

export const TodoInput = ({ onUpdate }: TodoInputProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [form] = Form.useForm();

  const onAddTodo: FormProps<FieldType>['onFinish'] = async (value) => {
    try {
      setIsLoading(true);

      const serverTodo = await postTodo({ isDone: false, title: value.title });

      if (serverTodo) {
        await onUpdate();
        setIsLoading(false);
      }
      form.resetFields();
    } catch (error) {
      console.error(error);
    }
  };

  // const onCreateTodo = (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   onAddTodo();
  // };

  // const onChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const value = e.target.value;
  //   setTodoTitle(value);
  //   setTodoTitleError(validateTitle(value));
  // };
  return (
    <>
      <Form className={`${styles.addTodo}`} form={form} onFinish={onAddTodo}>
        <Form.Item<FieldType> className={styles.input_value} name='title' rules={rulesTitle}>
          <Input placeholder='Task To Be Done...' />
        </Form.Item>
        <Button
          className={styles.button_input}
          disabled={isLoading}
          htmlType='submit'
          size='large'
          variant='solid'
          color='primary'
        >
          Add
        </Button>
      </Form>
    </>
  );
};
