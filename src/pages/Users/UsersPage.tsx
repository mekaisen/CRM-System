import type { RadioChangeEvent } from 'antd';

import { Button, Checkbox, Flex, Input, List, Pagination, Radio, Select } from 'antd';
import { useEffect, useState } from 'react';
import { Link } from 'react-router';

import type { UserFilters } from '@/types/users.ts';

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
  const [userFilters, setUserFilters] = useState<UserFilters>({});

  useEffect(() => {
    if (isAuth) {
      dispatch(getUsers(userFilters));
    }
  }, [isAuth]);
  useEffect(() => {
    dispatch(getUsers(userFilters));
  }, [userFilters]);
  const handleChange = (value: string) => {
    setUserFilters((prev) => ({
      sortBy: value,
      search: prev.search,
      isBlocked: prev.isBlocked,
      sortOrder: prev.sortOrder
    }));
  };
  const onChange = (e: RadioChangeEvent) => {
    setUserFilters((prev) => ({
      sortBy: prev.sortBy,
      search: prev.search,
      isBlocked: prev.isBlocked,
      sortOrder: e.target.value
    }));
  };
  const inputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserFilters((prev) => ({
      sortBy: prev.sortBy,
      search: e.target.value,
      isBlocked: prev.isBlocked,
      sortOrder: prev.sortOrder
    }));
  };
  const debounceInput = debounce(inputChange, 250);
  return (
    <Flex vertical align={'center'} style={{ width: 600 }}>
      <Flex>
        <Checkbox
          onChange={(e) =>
            setUserFilters((prev) => ({
              sortBy: prev.sortBy,
              search: prev.search,
              isBlocked: e.target.checked,
              sortOrder: prev.sortOrder
            }))
          }
        >
          заблокированные
        </Checkbox>
        <Radio.Group
          defaultValue={'asc'}
          onChange={onChange}
          options={[
            { value: 'asc', label: 'asc' },
            { value: 'desc', label: 'desc' }
          ]}
        />
        <Select
          defaultValue='id'
          style={{ width: 150 }}
          onChange={handleChange}
          options={[
            { value: 'email', label: 'email' },
            { value: 'username', label: 'username' },
            { value: 'id', label: 'id' }
          ]}
        />
        <Input onChange={debounceInput} />
      </Flex>
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
              <Link>Перейти в профиль</Link>
              <Button>Заблокировать</Button>
              <Button>удалить</Button>
            </Flex>
          </List.Item>
        )}
        dataSource={data?.data}
        itemLayout='vertical'
      />
      <Pagination
        hideOnSinglePage
        defaultCurrent={1}
        defaultPageSize={20}
        onChange={(page, pageSize) => {
          const totalItems = data?.meta.totalAmount ?? -1;
          const offset = (page - 1) * pageSize;
          let limit = pageSize;

          if (offset + pageSize > totalItems) {
            limit = totalItems - offset;
          }
          setUserFilters((prev) => ({ ...prev, offset: page, limit }));
        }}
        showSizeChanger={false}
        total={data?.meta.totalAmount}
      />
    </Flex>
  );
};
