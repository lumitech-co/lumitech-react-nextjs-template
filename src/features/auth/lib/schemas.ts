import { z } from 'zod';

const MIN_PASSWORD_LENGTH = 4;

const requiredEmail = z.string().min(1, 'Email is required');

export const signInSchema = z.object({
  email: requiredEmail.email('Enter a valid email'),
  password: z
    .string()
    .min(MIN_PASSWORD_LENGTH, 'Password must be at least 4 characters'),
});

export type SignInFormData = z.infer<typeof signInSchema>;

export const forgotPasswordSchema = z.object({
  email: requiredEmail.email('Enter a valid email'),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
