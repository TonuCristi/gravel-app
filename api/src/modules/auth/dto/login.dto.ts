import z from 'zod';

export const loginSchema = z.strictObject({
  email: z.string().toLowerCase().min(1, 'Email field is required!'),
  password: z.string().min(1, 'Password field is required!'),
});

export type LoginDto = z.infer<typeof loginSchema>;
