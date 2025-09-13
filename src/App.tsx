import type { GetProp, MenuProps } from 'antd';

import { UnorderedListOutlined, UserOutlined } from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import { Content } from 'antd/es/layout/layout';
import Sider from 'antd/es/layout/Sider';
import { useEffect, useState } from 'react';
import {
  createBrowserRouter,
  Link,
  Outlet,
  redirect,
  useLocation,
  useNavigate
} from 'react-router';

import { utilsTokens } from '@/helpers/tokenService.ts';
import { ProfilePage } from '@/pages/Profile/ProfilePage.tsx';
import { SignInPage } from '@/pages/SignIn/SignInPage.tsx';
import { SignUpPage } from '@/pages/SignUp/SignUpPage.tsx';
import { TodosPage } from '@/pages/Todos/TodosPage.tsx';
import { selectAuthIsAuth } from '@/store/selectors.ts';
import { authActions, refreshAccessToken } from '@/store/slices/authSlice.ts';
import { useAppDispatch, useAppSelector } from '@/store/store.ts';

import './App.css';

type MenuItem = GetProp<MenuProps, 'items'>[number];
const items: MenuItem[] = [
  {
    key: '/todos',
    icon: <UnorderedListOutlined />,
    label: <Link to='/todos'>Todo</Link>
  },
  {
    key: '/profile',
    icon: <UserOutlined />,
    label: <Link to='/profile'>Profile</Link>
  }
];

export const App = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const location = useLocation();
  return (
    <>
      <Layout style={{ minHeight: '100vh' }}>
        <Sider
          breakpoint={'md'}
          collapsed={isOpen}
          collapsible
          onCollapse={(value) => setIsOpen(value)}
        >
          <Menu
            defaultSelectedKeys={[location.pathname]}
            items={items}
            theme='dark'
            mode='inline'
          />
        </Sider>
        <Layout>
          <Content>
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </>
  );
};

const ProtectedRoute = () => {
  const isAuth = useAppSelector(selectAuthIsAuth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    const checkAuth = async () => {
      if (!isAuth) {
        const refreshToken = localStorage.getItem('refreshtoken');
        if (!refreshToken) {
          navigate('/signin');
          return;
        }
        try {
          const tokens = await dispatch(refreshAccessToken({ refreshToken })).unwrap();
          utilsTokens.setTokens(tokens);
          dispatch(authActions.setIsAuth(true));
        } catch {
          utilsTokens.removeTokens();
          dispatch(authActions.setIsAuth(false));
          navigate('/signin');
        }
      }
    };

    checkAuth();
  }, [isAuth]);
  if (!isAuth) {
    return null;
  }
  return <Outlet />;
};

// const protectedLoader = async () => {
//   console.log('render');
//   const isAuth = store.getState().auth.isAuth;
//   if (!isAuth) {
//     const refreshToken = refreshTokenService.getRefreshToken();
//     if (!refreshToken) {
//       return redirect('/signin');
//     }
//     try {
//       const tokens = await store.dispatch(refreshAccessToken({ refreshToken })).unwrap();
//       utilsTokens.setTokens(tokens);
//     } catch {
//       utilsTokens.removeTokens();
//       return redirect('/signin');
//     }
//   }
// };

export const router = createBrowserRouter([
  {
    path: '/',
    // loader: protectedLoader,
    Component: ProtectedRoute,
    shouldRevalidate: () => true,
    children: [
      {
        path: '/',
        Component: App,
        children: [
          {
            index: true,
            Component: App,
            loader() {
              return redirect('/todos');
            }
          },
          { path: '/todos', Component: TodosPage },
          {
            path: '/profile',
            Component: ProfilePage
          }
        ]
      }
    ]
  },
  { path: '/signup', Component: SignUpPage },
  { path: '/signin', Component: SignInPage }
]);
