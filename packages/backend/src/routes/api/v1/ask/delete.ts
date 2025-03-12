import plugin from 'fastify-plugin';
import { FromSchema } from 'json-schema-to-ts';
import AskService from '../../../../services/AskService.js';
import UserService from '../../../../services/UserService.js';

export default plugin(async (fastify) => {
	const schema = {
		tags: ['Ask'],
		params: {
			type: 'object',
			properties: {
				id: { type: 'string' }
			},
			required: ['id']
		}
	} as const;

	fastify.delete<{
		Params: FromSchema<typeof schema.params>;
	}>(
		'/api/v1/ask/:id',
		{
			schema: schema,
			preHandler: fastify.auth([fastify.requireAuth])
		},
		async (req, reply) => {
			const ask = await AskService.get({ id: req.params.id });

			if (!ask)
				return reply.status(404).send({
					message: 'Ask not found'
				});

			const requestingUser = await UserService.get({
				id: req.auth.user
			});

			if (
				ask.to.id !== req.auth.user ||
				(requestingUser && !requestingUser.admin)
			)
				return reply.status(404).send({
					message: 'Ask not found'
				});

			return await AskService.delete({ id: req.params.id }).then(() => {
				return reply.status(200).send({
					message: 'Deleted ask'
				});
			});
		}
	);
});
