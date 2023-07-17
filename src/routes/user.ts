import { FastifyInstance } from 'fastify';
import { User, createUserSchema } from '../models/user';
import { knex } from '../database';
import { randomUUID } from 'crypto';

export async function userRoutes(app: FastifyInstance): Promise<void>{
    app.post('/create', async (request, reply) => {
        const user: User = createUserSchema.parse(request.body);
        await knex('user').insert({
            ...user,
            userId: randomUUID()
        });
        await reply
            .status(201)
            .send();
    });
}
