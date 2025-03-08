import { LessThan, ObjectLiteral } from 'typeorm';
import db from '../utils/db.js';
import IdService from './IdService.js';
import UserService from './UserService.js';
import { NotificationType } from '../entities/Notification.js';
import SanitizerService from './SanitizerService.js';

class CommentService {
	public async get(where: ObjectLiteral) {
		return await db
			.getRepository('notification')
			.createQueryBuilder('notification')
			.leftJoinAndSelect('notification.to', 'to')
			.leftJoinAndSelect('notification.from', 'from')
			.leftJoinAndSelect('notification.comment', 'comment')
			.leftJoinAndSelect('notification.ask', 'ask')
			.where(where)
			.getOne();
	}

	public async getMany(where: ObjectLiteral, order?: string, take?: number) {
		return await db
			.getRepository('notification')
			.createQueryBuilder('notification')
			.leftJoinAndSelect('notification.to', 'to')
			.leftJoinAndSelect('notification.from', 'from')

			.leftJoinAndSelect('notification.comment', 'comment')
			.leftJoinAndSelect('comment.user', 'comment_user')
			.leftJoinAndSelect('comment.commentingOn', 'comment_commentingOn')

			.leftJoinAndSelect('notification.ask', 'ask')
			.where(where)
			.orderBy(order, 'DESC')
			.take(take ?? 45)
			.getMany();
	}

	public async create(
		type: NotificationType,
		to: string,
		from?: string,
		comment?: string,
		ask?: string
	) {
		const toUser = await UserService.get({ id: to });

		if (!toUser)
			return {
				error: true,
				status: 404,
				message: 'Notification target not found'
			};

		const id = IdService.generate();

		let notification = {
			id: id,
			toId: toUser.id,
			fromId: from,
			type: type,
			commentId: comment,
			askId: ask,
			createdAt: new Date().toISOString()
		};

		await db.getRepository('notification').insert(notification);

		return {
			error: false,
			status: 200,
			message: 'Notification created',
			notification: await this.get({ id: id })
		};
	}

	public async delete(where: ObjectLiteral) {
		return await db.getRepository('notification').delete(where);
	}

	public async read(since: string, as: string) {
		await db.getRepository('notification').update(
			{
				to: { id: as },
				createdAt: LessThan(since)
			},
			{
				read: true
			}
		);

		return {
			error: false,
			status: 200,
			message: 'Notifications read'
		};
	}
}

export default new CommentService();
