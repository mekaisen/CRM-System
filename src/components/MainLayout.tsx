import type { GetProp, MenuProps } from 'antd';

import { Layout, Menu } from 'antd';
import { Content } from 'antd/es/layout/layout';
import Sider from 'antd/es/layout/Sider';
import { useState } from 'react';

type MenuItem = GetProp<MenuProps, 'items'>[number];

interface MainLayoutProps {
  children: React.ReactNode;
  items: MenuItem[];
}

export const MainLayout = ({ children, items }: MainLayoutProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        breakpoint={'md'}
        collapsed={isOpen}
        collapsible
        onCollapse={(value) => setIsOpen(value)}
      >
        <Menu defaultSelectedKeys={[location.pathname]} items={items} theme='dark' mode='inline' />
      </Sider>
      <Layout>
        <Content>{children}</Content>
      </Layout>
    </Layout>
  );
};
