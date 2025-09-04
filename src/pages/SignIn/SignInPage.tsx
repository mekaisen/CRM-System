import type { FormProps } from 'antd';

import { Button, Flex, Form, Input, Layout, Typography } from 'antd';
import { Link, useNavigate } from 'react-router';

import { utilsTokens } from '@/helpers/tokenService.ts';
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
      utilsTokens.setTokens(tokens);
      dispatch(authActions.setIsAuth(true));
      navigate('/');
    } catch {
      utilsTokens.removeTokens();
      dispatch(authActions.setIsAuth(false));
    }
  };
  return (
    <Layout style={{ height: '100vh', alignItems: 'center', justifyContent: 'center' }}>
      <Flex vertical align={'center'} justify={'center'}>
        <Layout.Content style={{ height: '100%', flexShrink: '1', flexGrow: '1' }}>
          <Flex vertical align={'center'} justify={'center'}>
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
          </Flex>
        </Layout.Content>
      </Flex>
    </Layout>
  );
};
