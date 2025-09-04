import { Button, Flex, Typography } from 'antd';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';

import { utilsTokens } from '@/helpers/tokenService.ts';
import { selectAuthIsAuth, selectAuthProfile } from '@/store/selectors.ts';
import { authActions, getProfile, logoutUser } from '@/store/slices/authSlice.ts';
import { useAppDispatch, useAppSelector } from '@/store/store.ts';

const { Text } = Typography;

export const ProfilePage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { data } = useAppSelector(selectAuthProfile);
  const isAuth = useAppSelector(selectAuthIsAuth);

  useEffect(() => {
    if (isAuth) {
      dispatch(getProfile());
    }
  }, [isAuth]);

  const onLogout = async () => {
    await dispatch(logoutUser()).unwrap();
    utilsTokens.removeTokens();
    dispatch(authActions.setIsAuth(false));
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
