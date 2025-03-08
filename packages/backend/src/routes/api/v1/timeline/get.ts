import plugin from 'fastify-plugin';
import { FromSchema } from 'json-schema-to-ts';
import { In, IsNull, LessThan, Not } from 'typeorm';
import TimelineService from '../../../../services/TimelineService.js';
import AskRenderer from '../../../../services/renderers/AskRenderer.js';

export default plugin(async (fastify) => {
	const schema = {
		tags: ['Timeline'],
		params: {
			type: 'object',
			properties: {
				id: { type: 'string' }
			},
			required: ['id']
		},
		querystring: {
			type: 'object',
			properties: {
				since: { type: ['string', 'null'] },
				take: { type: ['number', 'null'] }
			}
		}
	} as const;

	fastify.get<{
		Params: FromSchema<typeof schema.params>;
		Querystring: FromSchema<typeof schema.querystring>;
	}>(
		'/api/v1/timeline/:id',
		{
			schema: schema,
			preHandler: fastify.auth([fastify.optionalAuth])
		},
		async (req, reply) => {
			let where = {
				to: req.params.id
			};

			console.log(req.auth?.user, req.params.id);
			if (req.auth?.user === req.params.id) {
				where['visibility'] = In(['public', 'private']);
			} else {
				where['visibility'] = 'public';
				where['response'] = Not(IsNull());
			}

			let take;

			if (req.query.since) where['createdAt'] = LessThan(req.query.since);
			if (req.query.take) take = req.query.take;

			console.log(where);

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
