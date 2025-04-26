import plugin from 'fastify-plugin';
import pkg from '../../../../../../../package.json' with { type: 'json' };
import config from '../../../../../../../config/config.json' with { type: 'json' };
import db from '../../../../utils/db.js';
import { IsNull, Not } from 'typeorm';

export default plugin(async (fastify) => {
	const schema = {
		tags: ['Meta']
	} as const;

	fastify.get(
		'/api/v1/meta',
		{
			schema: schema
		},
		async (req, reply) => {
			let userCount = await db.getRepository('user').count();
			let askCount = await db.getRepository('ask').count();
			let responseCount = await db.getRepository('ask').count({
				where: {
					response: Not(IsNull())
				}
			});
			let commentCount = await db.getRepository('comment').count();

			return reply.status(200).send({
				title: config.meta?.title,
				version: pkg.version,
				registrations: config.registrations ?? 'closed',
				stats: {
					asks: askCount,
					responses: responseCount,
					comments: commentCount,
					users: userCount
				}
			});
		}
	);
});
