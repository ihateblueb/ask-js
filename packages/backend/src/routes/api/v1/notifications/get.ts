import plugin from 'fastify-plugin';
import { FromSchema } from 'json-schema-to-ts';
import { In, IsNull, LessThan, Not } from 'typeorm';
import TimelineService from '../../../../services/TimelineService.js';

export default plugin(async (fastify) => {
	const schema = {
		tags: ['Notifications'],
		querystring: {
			type: 'object',
			properties: {
				since: { type: ['string', 'null'] },
				take: { type: ['number', 'null'] },
				read: { type: ['boolean', 'null'] }
			}
		}
	} as const;

	fastify.get<{
		Querystring: FromSchema<typeof schema.querystring>;
	}>(
		'/api/v1/notifications',
		{
			schema: schema,
			preHandler: fastify.auth([fastify.requireAuth])
		},
		async (req, reply) => {
			let where = {
				to: { id: req.auth.user }
			};

			let take;

			if (req.query.since) where['createdAt'] = LessThan(req.query.since);
			if (req.query.take) take = req.query.take;

			if (!req.query.read) where['read'] = false;

			console.log(where);

			return await TimelineService.get(
				'notification',
				where,
				'notification.createdAt',
				take
			).then((e) => {
				if (e && e.length > 0) return reply.status(200).send(e);
				return reply.status(204).send();
			});
		}
	);
});
