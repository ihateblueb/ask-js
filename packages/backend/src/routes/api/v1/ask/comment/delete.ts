import plugin from 'fastify-plugin';
import { FromSchema } from 'json-schema-to-ts';
import AskService from '../../../../../services/AskService.js';
import UserService from '../../../../../services/UserService.js';
import ReplyService from '../../../../../services/CommentService.js';

export default plugin(async (fastify) => {
	const schema = {
		tags: ['Ask'],
		params: {
			type: 'object',
			properties: {
				id: { type: 'string' },
				commentId: { type: 'string' }
			},
			required: ['id', 'commentId']
		}
	} as const;

	fastify.delete<{
		Params: FromSchema<typeof schema.params>;
	}>(
		'/api/v1/ask/:id/comment/:commentId',
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

			const comment = await ReplyService.get({
				id: req.params.commentId
			});

			if (!comment)
				return reply.status(404).send({
					message: 'Comment not found'
				});

			const requestingUser = await UserService.get({
				id: req.auth.user
			});

			if (
				ask.to.id !== req.auth.user ||
				(requestingUser && !requestingUser.admin) ||
				comment.user.id !== req.auth.user
			)
				return reply.status(404).send({
					message: 'Ask or comment not found'
				});

			return await ReplyService.delete({ id: req.params.commentId }).then(
				() => {
					return reply.status(200).send({
						message: 'Deleted comment'
					});
				}
			);
		}
	);
});
