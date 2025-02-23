import plugin from 'fastify-plugin';
import { FromSchema } from 'json-schema-to-ts';

export default plugin(async (fastify) => {
	const schema = {
		tags: ['Auth'],
		body: {
			type: 'object',
			properties: {
				username: { type: 'string' },
				password: { type: 'string' }
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
			return reply.status(501).send();
		}
	);
});
