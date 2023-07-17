import { z } from 'zod';

export interface Meal{
    mealId?: string;
    name: string;
    description: string;
    dateTime: Date;
    isDiet: boolean;
    userId?: string;
}

export const mealDataSchema = z.object({
    mealId: z.string().uuid(),
    name: z.string(),
    description: z.string(),
    dateTime: z.coerce.date(),
    isDiet: z.boolean(),
    userId: z.string().uuid()
});

export const createMealSchema = z.object({
    name: z.string(),
    description: z.string(),
    dateTime: z.coerce.date(),
    isDiet: z.boolean()
});

export const mealIdParamsSchema = z.object({
    mealId: z.string().uuid()
});

export const mealIdLoginParamsSchema = z.object({
    mealId: z.string().uuid(),
    login: z.string()
});
