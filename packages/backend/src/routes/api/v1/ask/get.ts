import plugin from 'fastify-plugin';
import { FromSchema } from 'json-schema-to-ts';
import AskService from '../../../../services/AskService.js';
import AskRenderer from '../../../../services/renderers/AskRenderer.js';

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

	fastify.get<{
		Params: FromSchema<typeof schema.params>;
	}>(
		'/api/v1/ask/:id',
		{
			schema: schema
		},
		async (req, reply) => {
			const ask = await AskService.get({ id: req.params.id });

			if (!ask || ask.visibility === 'private' || !ask.response)
				return reply.status(404).send({ message: 'Ask not found' });

			return reply.status(200).send(await AskRenderer.build(ask));
		}
	);
});
