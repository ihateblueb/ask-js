import plugin from 'fastify-plugin';
import { FromSchema } from 'json-schema-to-ts';
import { In, IsNull, LessThan, Not } from 'typeorm';
import TimelineService from '../../../services/TimelineService.js';
import AskRenderer from '../../../services/renderers/AskRenderer.js';
import UserService from '../../../services/UserService.js';
import AtomFeedRenderer from '../../../services/renderers/AtomFeedRenderer.js';
import AskAtomRenderer from '../../../services/renderers/AskAtomRenderer.js';

export default plugin(async (fastify) => {
	const schema = {
		tags: ['Atom'],
		params: {
			type: 'object',
			properties: {
				username: { type: 'string' }
			},
			required: ['username']
		}
	} as const;

	fastify.get<{
		Params: FromSchema<typeof schema.params>;
	}>(
		'/@:username/atom',
		{
			schema: schema
		},
		async (req, reply) => {
			const user = await UserService.get({
				username: req.params.username
			});

			if (!user)
				return reply.status(404).send({
					message: 'User not found'
				});

			if (!user.showResponses)
				return reply.status(403).send({
					message: 'User has responses hidden'
				});

			return await TimelineService.get(
				'ask',
				{
					to: { id: user.id },
					visibility: 'public',
					response: Not(IsNull())
				},
				'ask.createdAt',
				45
			).then(async (e) => {
				if (e && e.length > 0)
					return reply
						.header('Content-Type', 'application/atom+xml')
						.status(200)
						.send(
							await AtomFeedRenderer.build(
								user.id,
								await AskAtomRenderer.buildMany(e)
							)
						);
				return reply.status(204).send();
			});
		}
	);
});
