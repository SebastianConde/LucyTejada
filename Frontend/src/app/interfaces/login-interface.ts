export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface TokenPayload {
  rol: string,
  sub: string,
  iat: number,
  exp: number,
}