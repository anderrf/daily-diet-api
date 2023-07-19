import { FastifyReply, FastifyRequest } from 'fastify';
import { userParamsSchema } from '../models/user';
import { userRepository } from '../repository/userRepository';

export async function checkUserLoginExists(
    request: FastifyRequest,
    reply: FastifyReply,
) {
    const { login } = userParamsSchema.parse(request.params);
    if (!login) {
      return reply.status(401).send({
        error: 'Unauthorized',
      });
    }
    const user = await userRepository.getUserByLogin(login);
    if(!user){
      return reply.status(404).send({
        error: 'User not found',
      });
    }
}