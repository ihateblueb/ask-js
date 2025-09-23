import plugin from 'fastify-plugin';
import { FromSchema } from 'json-schema-to-ts';
import AskService from '../../../../services/AskService.js';

export default plugin(async (fastify) => {
	const schema = {
		tags: ['Ask'],
		body: {
			type: 'object',
			properties: {
				to: { type: ['string'], minLength: 1, maxLength: 8192 },
				cw: { type: ['string', 'null'], maxLength: 500 },
				content: { type: ['string'], minLength: 1, maxLength: 8192 },
				visibility: { type: ['string'], maxLength: 15 },
				nickname: { type: ['string', 'null'], maxLength: 100 }
			}
		}
	} as const;

	fastify.post<{
		Body: FromSchema<typeof schema.body>;
	}>(
		'/api/v1/ask',
		{
			schema: schema,
			preHandler: fastify.auth([fastify.optionalAuth])
		},
		async (req, reply) => {
			if (
				await AskService.isSenderBanned(
					req.body.to,
					req.ip,
					req.auth.user
				)
			)
				return reply.status(403).send({
					message: "You've been banned from this inbox"
				});

			return await AskService.create(
				req.body.to,
				req.body.content,
				req.body.visibility,
				req.body.cw,
				req.body.nickname
			).then(async (e) => {
				await AskService.createModRecord(
					e.ask.id,
					req.ip,
					req.auth.user
				);

				return reply.status(e.status).send({
					message: e.message,
					ask: e.ask
				});
			});
		}
	);
});
