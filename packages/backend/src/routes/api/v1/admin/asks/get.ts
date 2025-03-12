import plugin from 'fastify-plugin';
import { FromSchema } from 'json-schema-to-ts';
import { In, IsNull, LessThan, Not } from 'typeorm';
import TimelineService from '../../../../../services/TimelineService.js';
import AskRenderer from '../../../../../services/renderers/AskRenderer.js';
import UserService from '../../../../../services/UserService.js';

export default plugin(async (fastify) => {
	const schema = {
		tags: ['Admin'],
		querystring: {
			type: 'object',
			properties: {
				since: { type: ['string', 'null'] },
				take: { type: ['number', 'null'] }
			}
		}
	} as const;

	fastify.get<{
		Querystring: FromSchema<typeof schema.querystring>;
	}>(
		'/api/v1/admin/asks',
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

			let where = {};

			let take;

			if (req.query.since) where['createdAt'] = LessThan(req.query.since);
			if (req.query.take) take = req.query.take;

			return await TimelineService.get(
				'ask',
				where,
				'ask.createdAt',
				take
			).then(async (e) => {
				if (e && e.length > 0)
					return reply
						.status(200)
						.send(await AskRenderer.buildMany(e));
				return reply.status(204).send();
			});
		}
	);
});
