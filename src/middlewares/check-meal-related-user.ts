import { FastifyReply, FastifyRequest } from 'fastify';
import { mealIdLoginParamsSchema } from '../models/meal';
import { userRepository } from '../repository/userRepository';
import { mealRepository } from '../repository/mealRepository';

export async function checkMealRelatedUser(
    request: FastifyRequest,
    reply: FastifyReply,
  ) {
    const { login, mealId } = mealIdLoginParamsSchema.parse(request.params);
    const user = await userRepository.getUserByLogin(login!);
    const meal = await mealRepository.getSingleMealByMealId(mealId!);
    if(!user || !meal){
        return reply.status(404).send({
            error: 'Not found'
        });
    }
    if(meal?.userId !== user?.userId){
        return reply.status(401).send({
            error: 'Unauthorized'
        });
    }
}