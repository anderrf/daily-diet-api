import { z } from 'zod';

export interface User{
    userId?: string;
    login: string;
    name: string;
    email: string;
    password?: string;
}

export const userDataSchema = z.object({
    userId: z.string().uuid(),
    login: z.string(),
    name: z.string(),
    email: z.string().email(),
    password: z.string(),
});

export const createUserSchema = z.object({
    login: z.string(),
    name: z.string(),
    email: z.string().email(),
    password: z.string()
});

export const signinUserSchema = z.object({
    login: z.string(),
    password: z.string()
});

export const userParamsSchema = z.object({
    login: z.string()
});
