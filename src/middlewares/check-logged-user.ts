import { FastifyReply, FastifyRequest } from 'fastify'

export async function checkLoggedUserRequiredLogin(
    request: FastifyRequest,
    reply: FastifyReply,
) {
    const sessionId = request.cookies.sessionId;
    if (!sessionId) {
      return reply.status(401).send({
        error: 'Unauthorized',
      });
    }
}

export async function checkLoggedUserRequiredLogoff(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const sessionId = request.cookies.sessionId;
  if (sessionId) {
    return reply.status(403).send({
      error: 'Forbidden',
    });
  }
}
