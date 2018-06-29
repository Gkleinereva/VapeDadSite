export interface UserDetails {
  email: string;
  exp: number;

  // I'm not sure what this thing does...
  iat: number;
}

export interface TokenResponse {
  token: string;
}

export interface TokenPayload {
  email: string;
  password: string;
}