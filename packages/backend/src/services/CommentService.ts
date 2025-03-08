import { ObjectLiteral } from 'typeorm';
import db from '../utils/db.js';
import IdService from './IdService.js';
import SanitizerService from './SanitizerService.js';
import AskService from './AskService.js';
import NotificationService from './NotificationService.js';

class CommentService {
	public async get(where: ObjectLiteral) {
		return await db
			.getRepository('comment')
			.createQueryBuilder('comment')
			.leftJoinAndSelect('comment.user', 'user')
			.where(where)
			.getOne();
	}

	public async getMany(where: ObjectLiteral, order?: string, take?: number) {
		return await db
			.getRepository('comment')
			.createQueryBuilder('comment')
			.leftJoinAndSelect('comment.user', 'user')
			.where(where)
			.orderBy(order, 'DESC')
			.take(take ?? 45)
			.getMany();
	}

	public async create(as: string, commentingOn: string, content: string) {
		const commentingOnAsk = await AskService.get({ id: commentingOn });

		if (!commentingOnAsk)
			return {
				error: true,
				status: 404,
				message: 'Ask not found'
			};

		const id = IdService.generate();

		const comment = {
			id: id,
			userId: as,
			commentingOnId: commentingOn,
			content: SanitizerService.sanitize(content),
			createdAt: new Date().toISOString()
		};

		await db.getRepository('comment').insert(comment);

		await NotificationService.create('comment', commentingOnAsk.to, as, id);

		return {
			error: false,
			status: 200,
			message: 'Comment created',
			comment: await this.get({ id: id })
		};
	}

	public async delete(where: ObjectLiteral) {
		return await db.getRepository('comment').delete(where);
	}
}

export default new CommentService();
