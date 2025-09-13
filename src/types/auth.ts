export interface UserRegistration {
  email: string;
  login: string;
  password: string;
  phoneNumber: string;
  username: string;
}

export interface AuthData {
  login: string;
  password: string;
}

export interface RefreshToken {
  refreshToken: string;
}

export interface Profile {
  date: string;
  email: string;
  id: number;
  isBlocked: boolean;
  phoneNumber: string;
  roles: Role[];
  username: string;
}

export interface ProfileRequest {
  email: string;
  phoneNumber: string;
  username: string;
}

export interface PasswordRequest {
  password: string;
}

export interface Token {
  accessToken: string;
  refreshToken: string;
}

export type Role = 'ADMIN' | 'MODERATOR' | 'USER';
