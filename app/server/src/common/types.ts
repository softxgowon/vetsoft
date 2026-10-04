import { Role } from './enums';

// данные пользователя, которые лежат в jwt и попадают в request.user
export interface AuthUser {
  id: string;
  email: string;
  role: Role;
}

export interface JwtPayload {
  sub: string;
  email: string;
  role: Role;
}
