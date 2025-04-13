export interface User {
    id: number;
    email: string | null;
    username: string | null;
    is_new_user: boolean;
  }

export interface UserParams {
    uid: string | null;
    email: string | null;
    password: string | null;
  }
  
export interface CreateUserData {
    uid: string | null;
    username: string | null;
    email: string | null;
    password: string | null;
    provider: string | null;
}