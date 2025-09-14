import { Button } from 'antd';

import type { User, UserFilters } from '@/types/users.ts';

import { UserItem } from '@/components/UserItem.tsx';
import { selectAdminUsers } from '@/store/selectors.ts';
import { useAppSelector } from '@/store/store.ts';

interface UsersListProps {
  userFilters: UserFilters;
  onSortByUsernameOrEmailOrId: (sortBy: string) => void;
}

export const UsersList = ({ userFilters, onSortByUsernameOrEmailOrId }: UsersListProps) => {
  const { data } = useAppSelector(selectAdminUsers);

  const onClickUsername = () => onSortByUsernameOrEmailOrId('username');
  const onClickEmail = () => onSortByUsernameOrEmailOrId('email');

  return (
    <table>
      <thead>
        <tr>
          <th>
            <Button onClick={onClickUsername}>Имя пользователя</Button>
          </th>
          <th>
            <Button onClick={onClickEmail}>Email</Button>
          </th>
          <th>Дата регистрации</th>
          <th>Статус блокировки</th>
          <th>Роли</th>
          <th>Номер телефона</th>
          <th>Действия </th>
        </tr>
      </thead>
      <tbody>
        {data?.data.map((user: User) => {
          return <UserItem key={user.id} user={user} userFilters={userFilters} />;
        })}
      </tbody>
    </table>
  );
};
