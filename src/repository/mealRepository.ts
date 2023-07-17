import { randomUUID } from 'crypto';
import { knex } from '../database';
import { User } from '../models/user';
import { Meal } from '../models/meal';

export const mealRepository = {

    async createMeal(meal: Meal): Promise<void>{
        return await knex('meal')
            .insert({
                ...meal,
                mealId: randomUUID()
            });
    },

    async getSingleMealByMealId(mealId: string): Promise<Meal | undefined>{
        return await knex('meal')
            .where({
                mealId
            })
            .first();
    },

    async getMealsListByUserId(userId: string): Promise<Meal[] | undefined>{
        return await knex('meal')
            .where({
                userId
            })
            .select();
    },

    async updateMealByMealId(meal: Meal): Promise<Meal | undefined>{
        const { mealId, name, description, dateTime, isDiet } = meal!;
        await knex('meal')
            .where({
                mealId
            })
            .update({
                name,
                description,
                dateTime,
                isDiet
            });
        return await this.getSingleMealByMealId(mealId!);
    },

    async deleteMealByMealId(mealId: string): Promise<void | undefined>{
        return await knex('meal')
            .where({
                mealId
            })
            .delete();
    }

}
