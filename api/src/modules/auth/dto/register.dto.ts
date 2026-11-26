import z from 'zod';

export const registerSchema = z.strictObject({
  name: z
    .string()
    .trim()
    .min(1, 'Name field is required!')
    .max(100, 'Name must not exceed 100 characters!'),
  email: z.email({ error: 'Invalid email!' }).trim().toLowerCase(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters!')
    .max(72, 'Password must not exceed 72 characters!'),
});

export type RegisterDto = z.infer<typeof registerSchema>;
