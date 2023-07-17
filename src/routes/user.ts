import { FastifyInstance } from 'fastify';
import { User, createUserSchema, signinUserSchema, userParamsSchema } from '../models/user';
import { randomUUID } from 'crypto';
import { checkLoggedUserRequiredLogin, checkLoggedUserRequiredLogoff } from '../middlewares/check-logged-user';
import { userRepository } from '../repository/userRepository';

export async function userRoutes(app: FastifyInstance): Promise<void>{

    app.post(
        '/signup',
        {
            preHandler: [checkLoggedUserRequiredLogoff]
        },
        async (request, reply) => {
            const user: User = createUserSchema.parse(request.body);
            await userRepository.createUser(user);
            return reply
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
            let savedUser = await userRepository.getUserByLogin(login);
            if(password === savedUser?.password){
                return reply
                    .cookie('sessionId', randomUUID(), {
                        path: '/',
                        maxAge: 1000 * 60 * 60 * 24 // 1 day
                    })
                    .status(200)
                    .send();
            }
            else{
                return reply
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
            return reply.clearCookie('sessionId')
                .status(200)
                .send();
        }
    );

    app.get(
        '/:login',
        {
            preHandler: [checkLoggedUserRequiredLogin]
        },
        async (request, reply) => {
            const { login } = userParamsSchema.parse(request.params);
            const user = await userRepository.getSimpleUserDataByLogin(login);
            return reply
                .status(200)
                .send({
                    user
                });
        }
    );

    app.put(
        '/update/:login',
        {
            preHandler: [checkLoggedUserRequiredLogin]
        },
        async (request, reply) => {
            const { login } = userParamsSchema.parse(request.params);
            const user = createUserSchema.parse(request.body);
            const savedUser = await userRepository.getUserByLogin(login);
            if(!savedUser){
                return reply
                    .status(404)
                    .send();
            }
            if(login !== user.login){
                return reply
                    .status(403)
                    .send();
            }
            const updatedUser = await userRepository.updateUserByLogin(user);
            return reply
                .status(201)
                .send({
                    user: updatedUser
                });
        }
    )

}
