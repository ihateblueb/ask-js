import plugin from 'fastify-plugin';
import { FromSchema } from 'json-schema-to-ts';
import UserService from '../../../../services/UserService.js';

export default plugin(async (fastify) => {
	const schema = {
		tags: ['User'],
		params: {
			type: 'object',
			properties: {
				id: { type: 'string' }
			},
			required: ['id']
		}
	} as const;

	fastify.get<{
		Params: FromSchema<typeof schema.params>;
	}>(
		'/api/v1/user/:id',
		{
			schema: schema
		},
		async (req, reply) => {
			const user = await UserService.get({ id: req.params.id });

			if (!user || !user.approved)
				return reply.status(404).send({ message: 'User not found' });

			return reply.status(200).send(user);
		}
	);
});
