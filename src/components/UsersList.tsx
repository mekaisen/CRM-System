import type { CheckboxChangeEvent } from 'antd';

import { Button, Checkbox, Flex, List } from 'antd';
import { Link } from 'react-router';

import type { User, UserFilters } from '@/types/users.ts';

import { blockUser, changeUserRoles, deleteUser, unBlockUser } from '@/api/users.ts';
import { selectAdminUsers } from '@/store/selectors.ts';
import { getUsers } from '@/store/slices/usersSlice.ts';
import { useAppDispatch, useAppSelector } from '@/store/store.ts';
import { Roles } from '@/types/users.ts';

interface UsersListProps {
  userFilters: UserFilters;
}

export const UsersList = ({ userFilters }: UsersListProps) => {
  const { data } = useAppSelector(selectAdminUsers);
  const dispatch = useAppDispatch();

  const onChangeRole = async (e: CheckboxChangeEvent, item: User) => {
    let newRoles: Roles[];
    let roles: Roles[] = item.roles || [];
    const name = e.target.name as keyof typeof Roles;
    if (e.target.checked && name) {
      newRoles = roles.includes(Roles[name]) ? roles : [...roles, Roles[name]];
    } else {
      newRoles = roles.filter((r) => r !== Roles[name]);
    }
    try {
      await changeUserRoles(item.id, { roles: newRoles });
      dispatch(getUsers(userFilters));
    } catch (e) {
      console.error(e);
    }
  };

  const onBlockUser = async (userId: number) => {
    try {
      await blockUser(userId);
      await dispatch(getUsers(userFilters)).unwrap();
    } catch (e) {
      console.error(e);
    }
  };
  const onUnBlockUser = async (userId: number) => {
    try {
      await unBlockUser(userId);
      await dispatch(getUsers(userFilters)).unwrap();
    } catch (e) {
      console.error(e);
    }
  };
  const onDeleteUser = async (userId: number) => {
    try {
      await deleteUser(userId);
      await dispatch(getUsers(userFilters)).unwrap();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <List
      renderItem={(user) => (
        <List.Item key={user.id}>
          <Flex>
            <div>
              <div>
                <b>Имя пользователя:</b> {user.username}
              </div>
              <div>
                <b>Email пользователя:</b> {user.email}
              </div>
              <div>
                <b>Дата регистрации:</b> {new Date(user.date).toLocaleDateString()}
              </div>
              <div>
                <b>Статус блокировки:</b> {user.isBlocked ? 'Заблокирован' : 'Не заблокирован'}
              </div>
              <div>
                <b>Роли:</b> {user.roles ? user.roles.join(', ') : 'Нет ролей'}
              </div>

              <div>
                <b>Номер телефона:</b> {user.phoneNumber || 'Отсутствует'}
              </div>
            </div>
            <Flex vertical align={'center'}>
              <Link to={`/users/${user.id}`}>Перейти в профиль</Link>
              {!user.isBlocked ? (
                <Button onClick={() => onBlockUser(user.id)}>{'Заблокировать'}</Button>
              ) : (
                <Button onClick={() => onUnBlockUser(user.id)}>{'Разблокировать'}</Button>
              )}
              <Button onClick={() => onDeleteUser(user.id)}>удалить</Button>
            </Flex>

            <Flex vertical align={'center'}>
              <Checkbox
                defaultChecked={user.roles ? user.roles.includes(Roles.ADMIN) : false}
                name={'ADMIN'}
                onChange={(e) => onChangeRole(e, user)}
              >
                Роль ADMIN
              </Checkbox>
              <Checkbox
                defaultChecked={user.roles ? user.roles.includes(Roles.USER) : false}
                name={'USER'}
                onChange={(e) => onChangeRole(e, user)}
              >
                Роль USER
              </Checkbox>
              <Checkbox
                defaultChecked={user.roles ? user.roles.includes(Roles.MODERATOR) : false}
                name={'MODERATOR'}
                onChange={(e) => onChangeRole(e, user)}
              >
                Роль MODERATOR
              </Checkbox>
            </Flex>
          </Flex>
        </List.Item>
      )}
      dataSource={data?.data}
      itemLayout='vertical'
    />
  );
};
