import type { FormProps } from 'antd';

import { Button, Checkbox, Flex, Form, Modal } from 'antd';
import { useState } from 'react';
import { Link } from 'react-router';

import type { Roles, User, UserFilters } from '@/types/users.ts';

import { blockUser, changeUserRoles, deleteUser, unBlockUser } from '@/api/users.ts';
import { getUsers } from '@/store/slices/usersSlice.ts';
import { useAppDispatch } from '@/store/store.ts';

interface UserItemProps {
  user: User;
  userFilters: UserFilters;
}
interface FieldType {
  'checkbox-group': Roles[];
}

export const UserItem = ({ user, userFilters }: UserItemProps) => {
  const dispatch = useAppDispatch();
  const [modal, contextHolder] = Modal.useModal();
  const [isRolesEditing, setIsRolesEditing] = useState<boolean>(false);

  const onUserAction = async (userId: number, callback: (userId: number) => Promise<any>) => {
    try {
      const isConfirm = await modal.confirm({
        title: 'Подтвердите действие',
        content: 'Вы уверены, что хотите заблокировать пользователя?'
      });
      if (isConfirm) {
        await callback(userId);
        await dispatch(getUsers(userFilters)).unwrap();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
    try {
      await changeUserRoles(user.id, { roles: values['checkbox-group'] });
      dispatch(getUsers(userFilters));
      setIsRolesEditing(false);
    } catch (e) {
      console.error(e);
    }
  };

  const onClickCancel = () => {
    setIsRolesEditing(false);
  };
  const onClickRolesEdit = () => {
    setIsRolesEditing(true);
  };
  const onClickUserAction = (callback: (userId: number) => Promise<any>) => () => {
    onUserAction(user.id, callback);
  };

  return (
    <>
      {contextHolder}
      <tr key={user.id}>
        <td>{user.username}</td>
        <td>{user.email}</td>
        <td>{new Date(user.date).toLocaleDateString()}</td>
        <td>{user.isBlocked ? 'Заблокирован' : 'Активен'}</td>
        <td>{user.roles ? user.roles.join(', ') : 'Нет ролей'}</td>
        <td>{user.phoneNumber || 'Нет номера телефона'}</td>
        <td>
          <Flex vertical>
            <Button variant={'solid'} color={'danger'} onClick={onClickUserAction(deleteUser)}>
              Удалить
            </Button>
            {user.isBlocked ? (
              <Button
                variant={'dashed'}
                color={'geekblue'}
                onClick={onClickUserAction(unBlockUser)}
              >
                разблокировать
              </Button>
            ) : (
              <Button variant={'dashed'} color={'danger'} onClick={onClickUserAction(blockUser)}>
                заблокировать
              </Button>
            )}
            <Button variant={'link'} color={'primary'}>
              <Link to={`/users/${user.id}`}>Перейти в Профиль</Link>
            </Button>
            <>
              {isRolesEditing ? (
                <Flex vertical align={'center'}>
                  <Form
                    initialValues={{
                      'checkbox-group': user.roles
                    }}
                    onFinish={onFinish}
                  >
                    <Form.Item name='checkbox-group'>
                      <Checkbox.Group>
                        <Checkbox name={'ADMIN'} value={'ADMIN'}>
                          Роль ADMIN
                        </Checkbox>
                        <Checkbox name={'USER'} value={'USER'}>
                          Роль USER
                        </Checkbox>
                        <Checkbox name={'MODERATOR'} value={'MODERATOR'}>
                          Роль MODERATOR11
                        </Checkbox>
                      </Checkbox.Group>
                    </Form.Item>

                    <Button htmlType={'submit'}> Сохранить</Button>
                    <Button onClick={onClickCancel}> Отменить</Button>
                  </Form>
                </Flex>
              ) : (
                <Button onClick={onClickRolesEdit}> Изменить роли</Button>
              )}
            </>
          </Flex>
        </td>
      </tr>
    </>
  );
};
