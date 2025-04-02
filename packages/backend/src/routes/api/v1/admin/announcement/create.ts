import plugin from 'fastify-plugin';
import { FromSchema } from 'json-schema-to-ts';
import UserService from '../../../../../services/UserService.js';
import InviteService from '../../../../../services/InviteService.js';
import AnnouncementService from '../../../../../services/AnnouncementService.js';

export default plugin(async (fastify) => {
    const schema = {
        tags: ['Admin'],
		body: {
			type: 'object',
			properties: {
				type: { type: ['string'], minLength: 1, maxLength: 15 },
				content: { type: ['string'], minLength: 1, maxLength: 8192 },
				validUntil: { type: ['string'], minLength: 1, maxLength: 250 }
			}
		}
    } as const;

    fastify.post<{
		Body: FromSchema<typeof schema.body>;
    }>(
        '/api/v1/admin/announcement',
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

            return reply
                .status(200)
                .send(await AnnouncementService.create(
                    req.body.type, 
                    req.body.content,
                    req.body.validUntil
                ));
        }
    );
});
