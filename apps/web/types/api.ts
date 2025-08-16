// API response types
export interface User {
  id: number;
  name: string;
  email: string;
  username?: string;
  phone?: string;
  website?: string;
  age?: number;
  role?: string;
  department?: string;
}

export interface UsersResponse {
  users: User[];
}

export interface UserResponse {
  user: User;
}

export interface Post {
  id: number;
  userId: number;
  title: string;
  body: string;
}

export interface Settings {
  count: number;
  type: string;
  data?: Record<string, unknown>;
}

export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export interface LiveData {
  timestamp: string;
  randomValue: number;
  counter: number;
  status: "active" | "inactive";
  message?: string;
}

export interface Message {
  id: number;
  text: string;
  timestamp: string;
  user?: string;
}

export interface ApiError {
  message: string;
  status?: number;
}
