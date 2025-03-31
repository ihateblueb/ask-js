import plugin from 'fastify-plugin';
import { FromSchema } from 'json-schema-to-ts';
import UserService from '../../../../services/UserService.js';

export default plugin(async (fastify) => {
	const schema = {
		tags: ['User'],
		params: {
			type: 'object',
			properties: {
				username: { type: 'string' }
			},
			required: ['username']
		}
	} as const;

	fastify.get<{
		Params: FromSchema<typeof schema.params>;
	}>(
		'/api/v1/user/lookup/:username',
		{
			schema: schema
		},
		async (req, reply) => {
			const user = await UserService.get({
				username: req.params.username
			});

			if (!user || !user.approved)
				return reply.status(404).send({ message: 'User not found' });

			return reply.status(200).send(user);
		}
	);
});
