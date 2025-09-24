import type { FormProps } from 'antd';

import { Button, Form, Input, Typography } from 'antd';
import { Link, useNavigate } from 'react-router';

import { tokenService } from '@/helpers/tokenService.ts';
import { selectAuthLogin } from '@/store/selectors.ts';
import { authActions, login } from '@/store/slices/authSlice.ts';
import { useAppDispatch, useAppSelector } from '@/store/store.ts';

interface SignInValues {
  login: string;
  password: string;
}

const { Text, Title } = Typography;

export const SignInPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();

  const { error, status } = useAppSelector(selectAuthLogin);

  const onFinish: FormProps<SignInValues>['onFinish'] = async (value) => {
    try {
      const tokens = await dispatch(login(value)).unwrap();
      tokenService.setTokens(tokens);
      dispatch(authActions.setIsAuth(true));
      navigate('/');
    } catch {
      tokenService.removeTokens();
      dispatch(authActions.setIsAuth(false));
    }
  };
  return (
    <>
      <Title>Авторизация</Title>
      <Form
        name='signin'
        style={{ maxWidth: 600 }}
        form={form}
        onFinish={onFinish}
        scrollToFirstError
      >
        <Form.Item
          rules={[
            { required: true, message: 'Пожалуйста введите свой login', whitespace: true },
            { max: 60, min: 2, message: 'от 2 до 60 символов' },
            { pattern: /^[a-z]+$/i, message: 'Разрешены только символы латинского алфавита!' }
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
        <Button htmlType='submit' size='large' variant='solid' block color='primary'>
          {status.isLoading ? 'Входим...' : 'Войти'}
        </Button>
        {error && <Text type={'danger'}>{error}</Text>}
      </Form>
      <Link to={'/signup'}>Регистрация</Link>
    </>
  );
};
