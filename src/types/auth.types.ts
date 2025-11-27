export interface LoginRequest {
  userName: string;
  password: string;
}

export interface LoginResponse {
  statusCode: number;
  message: string;
  payload?: {
    accessToken: string;
  };
}

export interface DecodedToken {
  userCode: string;
  sessionId: string;
  exp: number;
  iat: number;
}