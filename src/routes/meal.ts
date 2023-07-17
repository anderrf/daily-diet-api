import { FastifyInstance } from "fastify";
import { checkLoggedUserRequiredLogin } from "../middlewares/check-logged-user";
import { Meal, createMealSchema, mealIdLoginParamsSchema } from "../models/meal";
import { mealRepository } from "../repository/mealRepository";
import { userRepository } from "../repository/userRepository";
import { checkMealRelatedUser } from "../middlewares/check-meal-related-user";
import { userParamsSchema } from "../models/user";


export async function mealRoutes(app: FastifyInstance): Promise<void>{

    app.post(
        '/:login/create',
        {
            preHandler: [checkLoggedUserRequiredLogin]
        },
        async (request, reply) => {
            const { login } = userParamsSchema.parse(request.params);
            const meal: Meal = createMealSchema.parse(request.body);
            const user = await userRepository.getUserByLogin(login!);
            meal.userId = user?.userId;
            await mealRepository.createMeal(meal);
            return reply
                .status(201)
                .send();
        }
    );

    app.get(
        '/:login/:mealId',
        {
            preHandler: [checkLoggedUserRequiredLogin, checkMealRelatedUser]
        },
        async (request, reply) => {
            const { mealId } = mealIdLoginParamsSchema.parse(request.params);
            const meal = await mealRepository.getSingleMealByMealId(mealId!);
            return reply
                .status(200)
                .send({meal});
        }
    );

    app.get(
        '/:login',
        {
            preHandler: [checkLoggedUserRequiredLogin]
        },
        async (request, reply) => {
            const { login } = userParamsSchema.parse(request.params);
            const user = await userRepository.getUserByLogin(login);
            const meals = await mealRepository.getMealsListByUserId(user?.userId!);
            return reply
                .status(200)
                .send({meals});
        }
    );

    app.put(
        '/:login/:mealId',
        {
            preHandler: [checkLoggedUserRequiredLogin, checkMealRelatedUser]
        },
        async (request, reply) => {
            const { mealId } = mealIdLoginParamsSchema.parse(request.params);
            const meal: Meal = createMealSchema.parse(request.body);
            meal.mealId = mealId;
            const updatedMeal = await mealRepository.updateMealByMealId(meal);
            return reply
                .status(200)
                .send({meal: updatedMeal});
        }
    );

    app.delete(
        '/:login/:mealId',
        {
            preHandler: [checkLoggedUserRequiredLogin, checkMealRelatedUser]
        },
        async (request, reply) => {
            const { mealId } = mealIdLoginParamsSchema.parse(request.params);
            await mealRepository.deleteMealByMealId(mealId);
            return reply
                .status(204)
                .send();
        }
    )

}
