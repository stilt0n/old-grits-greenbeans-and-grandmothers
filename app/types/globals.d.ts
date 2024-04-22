export {};

export type UserRole = 'admin' | 'family' | 'user';

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      role?: 'admin' | 'family' | 'user';
    };
  }
}
