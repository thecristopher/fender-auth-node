import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email().max(255),
  password: z.string().min(8).max(128)
});

export const updateMeSchema = z.object({
  name: z.string().min(1).max(120).optional(),
  email: z.string().email().max(255).optional(),
  password: z.string().min(8).max(128).optional()
}).refine(d => Object.keys(d).length > 0, { message: 'At least one field must be provided' });

