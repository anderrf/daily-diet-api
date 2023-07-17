import fastify from 'fastify';
import { userRoutes } from './routes/user';

const app = fastify();

app.register(userRoutes, {
    prefix: 'user'
});

export default app;