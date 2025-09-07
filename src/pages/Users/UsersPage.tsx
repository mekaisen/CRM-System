import { Flex, Input, Pagination, Select } from 'antd';
import { useEffect, useState } from 'react';

import type { UserFilters } from '@/types/users.ts';

import { UsersList } from '@/components/UsersList.tsx';
import { selectAdminUsers, selectAuthIsAuth } from '@/store/selectors.ts';
import { getUsers } from '@/store/slices/usersSlice.ts';
import { useAppDispatch, useAppSelector } from '@/store/store.ts';

const debounce = (callback: (...args: any[]) => void, timeout: number) => {
  let timer: any;

  return (...args: any[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      callback(...args);
    }, timeout);
  };
};

export const UsersPage = () => {
  const isAuth = useAppSelector(selectAuthIsAuth);
  const { data } = useAppSelector(selectAdminUsers);
  const dispatch = useAppDispatch();
  const [userFilters, setUserFilters] = useState<UserFilters>({ limit: 20 });

  useEffect(() => {
    if (isAuth) {
      dispatch(getUsers(userFilters));
    }
  }, [isAuth]);

  useEffect(() => {
    dispatch(getUsers(userFilters));
  }, [userFilters]);

  const debounceOnInputChanged = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
    setUserFilters((prev) => ({
      sortBy: prev.sortBy,
      search: e.target.value,
      isBlocked: prev.isBlocked,
      sortOrder: prev.sortOrder,
      limit: prev.limit
    }));
  }, 250);

  const onSortByUsernameOrEmailOrId = (sortBy: string) => {
    setUserFilters((prev) => {
      let order = prev.sortOrder;
      if (!order) {
        order = 'asc';
      }
      order = order === 'asc' ? 'desc' : 'asc';
      return {
        sortBy,
        search: prev.search,
        isBlocked: prev.isBlocked,
        sortOrder: order,
        limit: prev.limit
      };
    });
  };

  const onChangePage = (page: number, pageSize: number) => {
    const totalItems = data?.meta.totalAmount ?? -1;
    const offset = (page - 1) * pageSize;
    let limit = pageSize;

    if (offset + pageSize > totalItems) {
      limit = totalItems - offset;
    }

    setUserFilters((prev) => ({ ...prev, page, limit }));
  };
  const onBlockUser = (value: string) =>
    setUserFilters((prev) => {
      let isBlocked: boolean | undefined;

      if (value === 'blockedUsers') {
        isBlocked = true;
      }
      if (value === 'UnblockedUsers') {
        isBlocked = false;
      }
      return {
        sortBy: prev.sortBy,
        search: prev.search,
        isBlocked,
        sortOrder: prev.sortOrder,
        limit: prev.limit
      };
    });
  return (
    <Flex vertical align={'center'}>
      <Flex>
        <Select
          defaultValue='allUsers'
          style={{ width: 150 }}
          onChange={onBlockUser}
          options={[
            { value: 'allUsers', label: 'Все пользователи' },
            { value: 'blockedUsers', label: 'Заблокированные пользователи' },
            { value: 'UnblockedUsers', label: 'Активные пользователи' }
          ]}
        />

        <Input onChange={debounceOnInputChanged} />
      </Flex>
      <UsersList
        userFilters={userFilters}
        onSortByUsernameOrEmailOrId={onSortByUsernameOrEmailOrId}
      />
      <Pagination
        hideOnSinglePage
        defaultCurrent={1}
        defaultPageSize={20}
        onChange={onChangePage}
        showSizeChanger={false}
        total={data?.meta.totalAmount}
      />
    </Flex>
  );
};
