import type { FormProps } from 'antd';

import { Button, Form, Input, message, Space, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';

import type { UserRequest } from '@/types/users.ts';

import { changeUserData } from '@/api/users.ts';
import { selectAdminUser } from '@/store/selectors.ts';
import { getUser } from '@/store/slices/usersSlice.ts';
import { useAppDispatch, useAppSelector } from '@/store/store.ts';

const { Title } = Typography;

const getChangedFields = <T extends Record<string, any>>(original: T, updated: T): Partial<T> => {
  const keys: (keyof typeof original)[] = Object.keys(original);
  const newObj: Partial<T> = {};
  keys.forEach((key) => {
    if (original[key] !== updated[key]) {
      newObj[key] = updated[key];
    }
  });

  return newObj;
};

export const UserPage = () => {
  const dispatch = useAppDispatch();
  const { userId } = useParams();
  const navigate = useNavigate();

  const { data } = useAppSelector(selectAdminUser);
  const [form] = Form.useForm();

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);

  useEffect(() => {
    if (userId) {
      dispatch(getUser(Number(userId)));
    }
  }, [userId]);
  const initialValues: UserRequest = {
    username: data?.username,
    email: data?.email,
    phoneNumber: data?.phoneNumber
  };
  useEffect(() => {
    if (data) {
      form.setFieldsValue(initialValues);
    }
  }, [data]);

  const handleOnFinish = (initialValues: UserRequest) => {
    const onFinish: FormProps<UserRequest>['onFinish'] = async (values) => {
      const changedValues = getChangedFields(initialValues, values);
      const isAnyChanged = Object.keys(changedValues).length > 0;

      if (!isAnyChanged) {
        message.info('Новые данные не изменены');
        return;
      }
      setSaving(true);
      try {
        await changeUserData(Number(userId), changedValues);
        message.success('Данные успешно обновлены');
        setIsEditing(false);
        await dispatch(getUser(Number(userId))).unwrap();
      } catch (error) {
        console.error(error);
        message.error('Ошибка при обновлении данных');
      } finally {
        setSaving(false);
      }
    };
    return onFinish;
  };

  const onCancel = () => {
    form.resetFields();
    setIsEditing(false);
  };
  const onEdit = () => setIsEditing(true);
  const onBack = () => navigate('..', { relative: 'path' });
  return (
    <div style={{ maxWidth: 600, margin: 'auto', padding: 20 }}>
      <Title level={2}>Профиль пользователя</Title>

      <Form
        initialValues={{ ...initialValues }}
        form={form}
        layout='vertical'
        onFinish={handleOnFinish(initialValues)}
      >
        <Form.Item
          label='Имя пользователя'
          name='username'
          rules={[{ required: true, message: 'Пожалуйста, введите имя пользователя' }]}
        >
          <Input disabled={!isEditing} />
        </Form.Item>

        <Form.Item
          rules={[
            { required: true, message: 'Пожалуйста, введите email' },
            { type: 'email', message: 'Введите корректный email' }
          ]}
          label='Email пользователя'
          name='email'
        >
          <Input disabled={!isEditing} />
        </Form.Item>

        <Form.Item
          label='Телефон'
          name='phoneNumber'
          rules={[{ required: true, message: 'Пожалуйста, введите телефон' }]}
        >
          <Input disabled={!isEditing} />
        </Form.Item>

        {!isEditing ? (
          <Button type='primary' onClick={onEdit}>
            Редактировать
          </Button>
        ) : (
          <Space>
            <Button disabled={saving} htmlType='submit' type='primary' loading={saving}>
              Сохранить
            </Button>
            <Button disabled={saving} onClick={onCancel}>
              Отмена
            </Button>
          </Space>
        )}
      </Form>
      <Button style={{ marginTop: 20 }} onClick={onBack}>
        Вернуться к таблице пользователей
      </Button>
    </div>
  );
};
