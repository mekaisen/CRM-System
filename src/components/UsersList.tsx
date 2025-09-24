import type { TableColumnsType } from 'antd';

import { Table } from 'antd';
import { format } from 'date-fns';

import type { User, UserFilters } from '@/types/users.ts';

import { UserActions } from '@/components/UserActions.tsx';
import { selectAdminUsers } from '@/store/selectors.ts';
import { useAppSelector } from '@/store/store.ts';

interface UsersListProps {
  userFilters: UserFilters;
}

export const UsersList = ({ userFilters }: UsersListProps) => {
  const { data } = useAppSelector(selectAdminUsers);

  const columns: TableColumnsType<User> = [
    {
      title: 'Имя пользователя',
      dataIndex: 'username',
      showSorterTooltip: { target: 'full-header' },
      sorter: (a, b) => a.username.localeCompare(b.username),
      defaultSortOrder: 'descend'
    },
    {
      title: 'Email',
      dataIndex: 'email',
      showSorterTooltip: { target: 'full-header' },
      sorter: (a, b) => a.email.localeCompare(b.email),
      defaultSortOrder: 'descend'
    },
    {
      title: 'Дата регистрации',
      dataIndex: 'date',
      render: (date: string) => <span>{format(date, 'dd.MM.yyyy')}</span>
    },
    {
      title: 'Статус блокировки',
      dataIndex: 'isBlocked',
      render: (isBlocked: boolean) => <span>{isBlocked ? 'Заблокирован' : 'Активен'}</span>
    },
    {
      title: 'Роли',
      dataIndex: 'roles'
    },
    {
      title: 'Номер телефона',
      dataIndex: 'phoneNumber'
    },
    {
      title: 'Действия',
      render: (_, user) => <UserActions user={user} userFilters={userFilters}></UserActions>
    }
  ];
  return (
    <>
      <Table columns={columns} dataSource={data?.data}></Table>
    </>

    // <table>
    //   <thead>
    //     <tr>
    //       <th>
    //         <Button onClick={onClickUsername}>Имя пользователя</Button>
    //       </th>
    //       <th>
    //         <Button onClick={onClickEmail}>Email</Button>
    //       </th>
    //       <th>Дата регистрации</th>
    //       <th>Статус блокировки</th>
    //       <th>Роли</th>
    //       <th>Номер телефона</th>
    //       <th>Действия </th>
    //     </tr>
    //   </thead>
    //   <tbody>
    //     {data?.data.map((user: User) => {
    //       return <UserItem key={user.id} user={user} userFilters={userFilters} />;
    //     })}
    //   </tbody>
    // </table>
  );
};
