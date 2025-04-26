import plugin from 'fastify-plugin';
import { FromSchema } from 'json-schema-to-ts';
import UserService from '../../../../../services/UserService.js';
import InviteService from '../../../../../services/InviteService.js';

export default plugin(async (fastify) => {
	const schema = {
		tags: ['Admin'],
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
		'/api/v1/admin/invite/:id',
		{
			schema: schema,
			preHandler: fastify.auth([fastify.requireAuth])
		},
		async (req, reply) => {
			const requestingUser = await UserService.get({
				id: req.auth.user
			});

			if (!requestingUser || !requestingUser.admin)
				return reply
					.status(403)
					.send({ message: 'You are not an admin' });

			const invite = await InviteService.get({
				id: req.params.id
			});

			if (invite.usedById)
				return reply
					.status(400)
					.send({ message: 'Cannot delete used invite' });

			return await InviteService.delete({
				id: req.params.id
			}).then(() => {
				return reply.status(200).send();
			});
		}
	);
});
