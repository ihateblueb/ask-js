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
		},
		body: {
			type: 'object',
			properties: {
				displayName: {
					type: ['string', 'null'],
					minLength: 1,
					maxLength: 100
				},
				avatar: {
					type: ['string', 'null'],
					minLength: 1,
					maxLength: 500
				},
				prompt: {
					type: ['string', 'null'],
					minLength: 1,
					maxLength: 8192
				}
			}
		}
	} as const;

	fastify.patch<{
		Params: FromSchema<typeof schema.params>;
		Body: FromSchema<typeof schema.body>;
	}>(
		'/api/v1/user/:id',
		{
			schema: schema,
			preHandler: fastify.auth([fastify.requireAuth])
		},
		async (req, reply) => {
			const user = await UserService.get({ id: req.params.id });

			if (!user)
				return reply.status(404).send({ message: 'User not found' });

			const requestingUser = await UserService.get({
				id: req.auth.user
			});

			if (requestingUser.id !== user.id && !requestingUser.admin)
				return reply
					.status(503)
					.send({ message: 'You cannot edit this user' });

			console.log(
				{ id: user.id },
				{
					avatar: req.body.avatar,
					displayName: req.body.displayName,
					prompt: req.body.prompt
				}
			);

			await UserService.update(
				{ id: user.id },
				{
					avatar: req.body.avatar,
					displayName: req.body.displayName,
					prompt: req.body.prompt
				}
			);

			return reply
				.status(200)
				.send(await UserService.get({ id: user.id }));
		}
	);
});
