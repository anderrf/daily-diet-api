import { FastifyInstance } from 'fastify';
import { User, createUserSchema, signinUserSchema } from '../models/user';
import { knex } from '../database';
import { randomUUID } from 'crypto';
import { checkLoggedUserRequiredLogin, checkLoggedUserRequiredLogoff } from '../middlewares/check-logged-user';

export async function userRoutes(app: FastifyInstance): Promise<void>{

    app.post(
        '/signup',
        {
            preHandler: [checkLoggedUserRequiredLogoff]
        },
        async (request, reply) => {
            const user: User = createUserSchema.parse(request.body);
            await knex('user').insert({
                ...user,
                userId: randomUUID()
            });
            await reply
                .status(201)
                .send();
        }
    );

    app.post(
        '/signin',
        {
            preHandler: [checkLoggedUserRequiredLogoff]
        },
        async (request, reply) => {
            const { login, password } = signinUserSchema.parse(request.body);
            let savedUser = await knex('user')
                .where({login})
                .first();
            if(password === savedUser?.password){
                await reply
                    .cookie('sessionId', randomUUID(), {
                        path: '/',
                        maxAge: 1000 * 60 * 60 * 24 // 1 day
                    })
                    .status(200)
                    .send();
            }
            else{
                await reply
                    .status(401)
                    .send();
            }
        }
    );

    app.delete(
        '/signout',
        {
            preHandler: [checkLoggedUserRequiredLogin]
        },
        async (request, reply) => {
            await reply.clearCookie('sessionId')
                .status(200)
                .send();
        }
    );

}
