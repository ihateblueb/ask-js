import plugin from 'fastify-plugin';
import { FromSchema } from 'json-schema-to-ts';
import AskService from '../../../../services/AskService.js';
import UserService from '../../../../services/UserService.js';
import AutopostService from '../../../../services/AutopostService.js';

export default plugin(async (fastify) => {
	const schema = {
		tags: ['Autopost'],
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
		'/api/v1/autopost/target/:id',
		{
			schema: schema,
			preHandler: fastify.auth([fastify.requireAuth])
		},
		async (req, reply) => {
			const target = await AutopostService.get({ id: req.params.id });

			if (!target)
				return reply.status(404).send({
					message: 'Target not found'
				});

			const requestingUser = await UserService.get({
				id: req.auth.user
			});

			if (
				target.user !== req.auth.user &&
				requestingUser &&
				!requestingUser.admin
			)
				return reply.status(404).send({
					message: 'Target not found'
				});

			return await AutopostService.delete({ id: req.params.id }).then(
				() => {
					return reply.status(200).send({
						message: 'Deleted target'
					});
				}
			);
		}
	);
});
