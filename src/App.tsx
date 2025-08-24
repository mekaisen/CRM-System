import type { GetProp, MenuProps } from 'antd';

import { UnorderedListOutlined, UserOutlined } from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import { Content } from 'antd/es/layout/layout';
import Sider from 'antd/es/layout/Sider';
import { useState } from 'react';
import { createBrowserRouter, Link, Outlet, useLocation } from 'react-router';

import { TodosPage } from '@/pages/Todos/TodosPage.tsx';

import './App.css';

const getCurrentLocationNumber = (location: string) => {
  switch (location) {
    case '/': {
      return '1';
    }
    case '/profile': {
      return '2';
    }
    default: {
      return '1';
    }
  }
};

type MenuItem = GetProp<MenuProps, 'items'>[number];
const items: MenuItem[] = [
  {
    key: '1',
    icon: <UnorderedListOutlined />,
    label: <Link to='/'>Todo</Link>
  },
  {
    key: '2',
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
            defaultSelectedKeys={[getCurrentLocationNumber(location.pathname)]}
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

export const router = createBrowserRouter([
  {
    path: '/',
    Component: App,

    children: [
      { index: true, Component: TodosPage },
      {
        path: '/profile',
        element: <div>Profile</div>
      }
    ]
  }
]);
