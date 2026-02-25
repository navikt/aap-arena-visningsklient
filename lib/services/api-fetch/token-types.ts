import { JWTPayload } from 'jose';

export type NAVJWTPayload = { NAVident: string; preferred_username: string } & JWTPayload;

export type TokenType = {
  token: string;
  payload: NAVJWTPayload;
};
