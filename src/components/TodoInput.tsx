import type { FormProps } from 'antd';

import { Button, Form, Input } from 'antd';
import { useState } from 'react';

import { postTodo } from '@/api/todos.ts';
import { rulesTitle } from '@/helpers/validationRules.ts';

import styles from '@/pages/Todos/todo.module.css';

interface TodoInputProps {
  onUpdate: () => Promise<void>;
}

interface FieldType {
  title: string;
}

export const TodoInput = ({ onUpdate }: TodoInputProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [form] = Form.useForm();

  const onAddTodo: FormProps<FieldType>['onFinish'] = async (value) => {
    try {
      setIsLoading(true);

      await postTodo({ isDone: false, title: value.title });

      await onUpdate();
      setIsLoading(false);

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
