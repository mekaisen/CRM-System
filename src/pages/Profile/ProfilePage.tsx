import { Button, Flex, Typography } from 'antd';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';

import { utilsTokens } from '@/helpers/tokenService.ts';
import { selectAuthIsAuth, selectAuthProfile } from '@/store/selectors.ts';
import { getProfile, logoutUser } from '@/store/slices/authSlice.ts';
import { useAppDispatch, useAppSelector } from '@/store/store.ts';

const { Text } = Typography;

export const ProfilePage = () => {
  console.log('ProfilePage');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { data } = useAppSelector(selectAuthProfile);
  const isAuth = useAppSelector(selectAuthIsAuth);

  useEffect(() => {
    console.log('useEffect', 'ProfilePage');
    if (isAuth) {
      dispatch(getProfile());
    }
  }, [isAuth]);

  const onLogout = async () => {
    await dispatch(logoutUser()).unwrap();
    utilsTokens.removeTokens();
    navigate('/signin');
  };

  return (
    <Flex vertical align={'center'} justify={'center'}>
      <Text>username: {data?.username}</Text>
      <Text>email: {data?.email}</Text>
      <Text>phoneNumber: {data?.phoneNumber}</Text>
      <Button variant={'outlined'} color={'blue'} onClick={onLogout}>
        Выйти из аккаунта
      </Button>
    </Flex>
  );
};
