import { Button, Checkbox, Flex, List } from 'antd';
import { Link } from 'react-router';

import type { UserFilters } from '@/types/users.ts';

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

  return (
    <List
      renderItem={(item) => (
        <List.Item key={item.id}>
          <Flex>
            <div>
              <div>
                <b>Имя пользователя:</b> {item.username}
              </div>
              <div>
                <b>Email пользователя:</b> {item.email}
              </div>
              <div>
                <b>Дата регистрации:</b> {new Date(item.date).toLocaleDateString()}
              </div>
              <div>
                <b>Статус блокировки:</b> {item.isBlocked ? 'Заблокирован' : 'Не заблокирован'}
              </div>
              <div>
                <b>Роли:</b> {item.roles.join(', ') || 'Нет ролей'}
              </div>

              <div>
                <b>Номер телефона:</b> {item.phoneNumber || 'Отсутствует'}
              </div>
            </div>
            <Link to={`/users/${item.id}`}>Перейти в профиль</Link>
            {!item.isBlocked ? (
              <Button
                onClick={async () => {
                  await blockUser(item.id);
                  await dispatch(getUsers(userFilters)).unwrap();
                }}
              >
                {'Заблокировать'}
              </Button>
            ) : (
              <Button
                onClick={async () => {
                  await unBlockUser(item.id);
                  await dispatch(getUsers(userFilters)).unwrap();
                }}
              >
                {'Разблокировать'}
              </Button>
            )}
            <Button
              onClick={async () => {
                await deleteUser(item.id);
                await dispatch(getUsers(userFilters)).unwrap();
              }}
            >
              удалить
            </Button>
            <Flex align={'center'}>
              <Checkbox
                defaultChecked={item.roles.includes(Roles.ADMIN)}
                onChange={async (e) => {
                  let newRoles: Roles[];

                  if (e.target.checked) {
                    // Добавляем роль, если её еще нет
                    newRoles = item.roles.includes(Roles.ADMIN)
                      ? item.roles
                      : [...item.roles, Roles.ADMIN];
                  } else {
                    // Удаляем роль из массива
                    newRoles = item.roles.filter((r) => r !== Roles.ADMIN);
                  }

                  // Вызываем изменение ролей, например, отправляем на сервер
                  await changeUserRoles(item.id, { roles: newRoles });
                  dispatch(getUsers(userFilters));
                }}
              >
                Роль ADMIN
              </Checkbox>
              <Checkbox
                defaultChecked={item.roles.includes(Roles.USER)}
                onChange={async (e) => {
                  let newRoles: Roles[];

                  if (e.target.checked) {
                    newRoles = item.roles.includes(Roles.USER)
                      ? item.roles
                      : [...item.roles, Roles.USER];
                  } else {
                    newRoles = item.roles.filter((r) => r !== Roles.USER);
                  }

                  await changeUserRoles(item.id, { roles: newRoles });
                  dispatch(getUsers(userFilters));
                }}
              >
                Роль USER
              </Checkbox>
              <Checkbox
                defaultChecked={item.roles.includes(Roles.MODERATOR)}
                onChange={async (e) => {
                  let newRoles: Roles[];

                  if (e.target.checked) {
                    newRoles = item.roles.includes(Roles.MODERATOR)
                      ? item.roles
                      : [...item.roles, Roles.MODERATOR];
                  } else {
                    newRoles = item.roles.filter((r) => r !== Roles.MODERATOR);
                  }

                  await changeUserRoles(item.id, { roles: newRoles });
                  dispatch(getUsers(userFilters));
                }}
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
