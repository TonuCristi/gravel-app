import { Prisma } from '../../../generated/prisma/client.js';

export type CreateUserInput = Pick<
  Prisma.UserCreateInput,
  'email' | 'name' | 'password'
>;
