import type { FormProps } from 'antd';

import { Button, Flex, Form, Input, Layout, message, Typography } from 'antd';
import { Link } from 'react-router';

import { selectAuthIsSuccessRegistration, selectAuthRegistration } from '@/store/selectors.ts';
import { authActions, registration } from '@/store/slices/authSlice.ts';
import { useAppDispatch, useAppSelector } from '@/store/store.ts';
interface FieldType {
  email: string;
  login: string;
  password: string;
  phoneNumber: string;
  username: string;
}

const { Text, Title } = Typography;

export const SignUpPage = () => {
  const isSuccessRegistration = useAppSelector(selectAuthIsSuccessRegistration);
  const { error, status } = useAppSelector(selectAuthRegistration);
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();

  const [messageApi, contextHolder] = message.useMessage();

  const onFinish: FormProps<FieldType>['onFinish'] = async (value) => {
    await dispatch(registration(value)).unwrap();
    dispatch(authActions.setIsSuccessRegistration(true));
    messageApi.open({ type: 'success', content: 'Успешная регистрация', duration: 6 });
  };
  return (
    <>
      {contextHolder}
      <Layout style={{ height: '100vh', alignItems: 'center', justifyContent: 'center' }}>
        <Flex vertical align={'center'} justify={'center'}>
          <Layout.Content style={{ height: '100%', flexShrink: '1', flexGrow: '1' }}>
            <Flex vertical align={'center'} justify={'center'}>
              <Title>Регистрация</Title>
              <Form
                name='register'
                style={{ maxWidth: 600 }}
                form={form}
                onFinish={onFinish}
                scrollToFirstError
              >
                <Form.Item
                  rules={[
                    {
                      required: true,
                      message: 'Пожалуйста напишите свое имя',
                      whitespace: true
                    },
                    {
                      pattern: /^[\p{Script=Cyrillic}\p{Script=Latin}]+$/u,
                      message: 'Разрешены только символы латинского или русского алфавита!'
                    },
                    { max: 60, min: 1, message: 'от 1 до 60 символов ' }
                  ]}
                  label='Имя'
                  name='username'
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  rules={[
                    { required: true, message: 'Пожалуйста введите свой login', whitespace: true },
                    { max: 60, min: 2, message: 'от 2 до 60 символов' },
                    {
                      pattern: /^[a-z]+$/i,
                      message: 'Разрешены только символы латинского алфавита!'
                    }
                  ]}
                  label='Логин'
                  name='login'
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  hasFeedback
                  rules={[
                    {
                      required: true,
                      message: 'Введите пароль!'
                    },
                    { max: 60, min: 6, message: 'от 6 до 60 символов' }
                  ]}
                  label='Пароль'
                  name='password'
                >
                  <Input.Password />
                </Form.Item>

                <Form.Item
                  hasFeedback
                  rules={[
                    {
                      required: true,
                      message: 'Пожалуйста подтвердите пароль!'
                    },

                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('password') === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error('Пароли должны совпадать!'));
                      }
                    })
                  ]}
                  dependencies={['password']}
                  label='Подтвердите пароль'
                  name='confirm'
                >
                  <Input.Password />
                </Form.Item>
                <Form.Item
                  rules={[
                    {
                      type: 'email',
                      message: 'Невалидный email'
                    },
                    {
                      required: true,
                      message: 'email обязателен для ввода'
                    }
                  ]}
                  label='E-mail'
                  name='email'
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  rules={[
                    {
                      pattern: /^\+?[78][-(]?\d{3}\)?-?\d{3}-?\d{2}-?\d{2}$/,
                      message: 'Неверный формат номера'
                    }
                  ]}
                  label='Номер телефона'
                  name='phoneNumber'
                >
                  <Input style={{ width: '100%' }} />
                </Form.Item>
                <Button htmlType='submit' size='large' variant='solid' block color='primary'>
                  {status.isLoading ? 'Регистрация пожалуйста подождите ' : 'Зарегистрироваться'}
                </Button>
                {error && <Text type={'danger'}>{error}</Text>}
              </Form>

              {isSuccessRegistration && (
                <Link to={'/signin'}>
                  <Text style={{ fontSize: '20px' }} type={'success'}>
                    Перейти на страницу авторизации для входа в систему
                  </Text>
                </Link>
              )}

              <Link to={'/signin'}>Авторизация</Link>
            </Flex>
          </Layout.Content>
        </Flex>
      </Layout>
    </>
  );
};
