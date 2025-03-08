import plugin from 'fastify-plugin';
import { FromSchema } from 'json-schema-to-ts';
import NotificationService from '../../../../services/NotificationService.js';

export default plugin(async (fastify) => {
	const schema = {
		tags: ['Notifications'],
		body: {
			type: 'object',
			properties: {
				since: { type: ['string', 'null'] }
			}
		}
	} as const;

	fastify.post<{
		Body: FromSchema<typeof schema.body>;
	}>(
		'/api/v1/notifications/read',
		{
			schema: schema,
			preHandler: fastify.auth([fastify.requireAuth])
		},
		async (req, reply) => {
			return await NotificationService.read(
				req.body.since ?? new Date().toISOString(),
				req.auth.user
			).then((e) => {
				return reply.status(200).send(e);
			});
		}
	);
});
