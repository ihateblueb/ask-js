import plugin from 'fastify-plugin';
import { FromSchema } from 'json-schema-to-ts';
import AuthService from '../../../../services/AuthService.js';

export default plugin(async (fastify) => {
	const schema = {
		tags: ['Auth'],
		body: {
			type: 'object',
			properties: {
				username: {
					type: 'string',
					minLength: 1,
					maxLength: 100,
					pattern: '^[a-zA-Z0-9]+$'
				},
				password: { type: 'string', minLength: 1, maxLength: 72 },
				invite: { type: 'string' }
			}
		}
	} as const;

	fastify.post<{
		Body: FromSchema<typeof schema.body>;
	}>(
		'/api/v1/auth/register',
		{
			schema: schema
		},
		async (req, reply) => {
			return await AuthService.registerUser(
				req.body.username,
				req.body.password,
				req.body.invite
			).then((e) => {
				return reply.status(e.status).send({
					message: e.message,
					user: e.user,
					token: e.token
				});
			});
		}
	);
});
