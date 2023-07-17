import fastify from 'fastify';
import cookie from '@fastify/cookie';
import { userRoutes } from './routes/user';

const app = fastify();

app.register(cookie);

app.register(userRoutes, {
    prefix: 'user'
});

export default app;