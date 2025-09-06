// Интерфейс запроса для фильтрации и сортировки пользователей
export interface UserFilters {
  isBlocked?: boolean;
  limit?: number; // сколько на странице
  offset?: number; // страницу
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Интерфейс пользователя
export interface User {
  date: string; // ISO date string
  email: string;
  id: number;
  isBlocked: boolean;
  phoneNumber: string;
  roles: Roles[];
  username: string;
}
// Интерфейс метаинформации

export interface MetaResponseUsers<T> {
  data: T[];
  meta: {
    totalAmount: number;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
  };
}
// Интерфейс для обновления прав пользователя
export interface UserRolesRequest {
  roles: Roles[]; // при вызове этой апи роли будут обновлены к тому массиву который будет передан
  // например если у вас была roles: ['ADMIN'] а вы хотите добавить ['MODERATOR'] то нужно передавать
  // старые + новые - roles: ['ADMIN', 'MODERATOR']
}

// Интерфейс для обновления данных пользователя
export interface UserRequest {
  email?: string;
  phoneNumber?: string;
  username?: string;
}

export enum Roles {
  ADMIN = 'ADMIN',
  MODERATOR = 'MODERATOR',
  USER = 'USER'
}
