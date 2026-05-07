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

const MIN_RESET_PASSWORD_LENGTH = 8;

const passwordComplexity = z
  .string()
  .min(MIN_RESET_PASSWORD_LENGTH, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Must contain at least one lowercase letter')
  .regex(/\d/, 'Must contain at least one digit')
  .regex(/[^A-Za-z0-9]/, 'Must contain at least one special character');

export const resetPasswordSchema = z
  .object({
    password: passwordComplexity,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
