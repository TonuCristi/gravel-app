export const ACCESS_TOKEN_COOKIE = 'access_token';
export const cookieOptions = {
  path: '/',
  httpOnly: true,
  sameSite: 'lax',
  secure: true,
  maxAge: 60 * 60 * 24,
} as const;
