import { Flex, Layout } from 'antd';
import { Outlet } from 'react-router';

export const AuthLayout = () => {
  return (
    <Layout style={{ height: '100vh', alignItems: 'center', justifyContent: 'center' }}>
      <Flex vertical align={'center'} justify={'center'}>
        <Layout.Content style={{ height: '100%', flexShrink: '1', flexGrow: '1' }}>
          <Flex vertical align={'center'} justify={'center'}>
            <Outlet />
          </Flex>
        </Layout.Content>
      </Flex>
    </Layout>
  );
};
