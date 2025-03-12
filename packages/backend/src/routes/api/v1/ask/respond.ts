import plugin from 'fastify-plugin';
import { FromSchema } from 'json-schema-to-ts';
import AuthService from '../../../../services/AuthService.js';
import AskService from '../../../../services/AskService.js';

export default plugin(async (fastify) => {
	const schema = {
		tags: ['Ask'],
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
				response: { type: ['string'], minLength: 1, maxLength: 8192 }
			}
		}
	} as const;

	fastify.post<{
		Body: FromSchema<typeof schema.body>;
		Params: FromSchema<typeof schema.params>;
	}>(
		'/api/v1/ask/:id/respond',
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

			if (ask.to.id !== req.auth.user)
				return reply.status(404).send({
					message: 'Ask not found'
				});

			return await AskService.respond(
				req.params.id,
				req.body.response
			).then((e) => {
				return reply.status(e.status).send({
					message: e.message,
					ask: e.ask
				});
			});
		}
	);
});
