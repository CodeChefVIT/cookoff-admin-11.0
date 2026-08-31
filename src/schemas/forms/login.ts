import * as z from 'zod';

export const loginFormSchema = z.object({
  email: z
    .string()
    .email({
      message: 'Invalid email address',
    })
    .trim(),
  password: z
    .string()
    .min(6, 'Password must not be lesser than 6 characters')
    .max(20, 'Password must not be greater than 20 characters')
    .trim(),
});
