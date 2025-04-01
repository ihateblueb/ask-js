import { ObjectLiteral } from 'typeorm';
import db from '../utils/db.js';

class UserService {
	public async get(where: ObjectLiteral) {
		return await db.getRepository('user').findOne({ where: where });
	}

	public async isUsernameTaken(username: string) {
		return Boolean(
			await db.getRepository('used_usernames').findOne({ where: { username: username.toLowerCase() } })
		);
	}

	public async getMany(where: ObjectLiteral, order?: string, take?: number) {
		return await db
			.getRepository('user')
			.createQueryBuilder('user')
			.where(where)
			.orderBy(order, 'ASC')
			.take(take ?? 45)
			.getMany();
	}

	public async getPrivate(where: ObjectLiteral) {
		return await db.getRepository('user_private').findOne({ where: where });
	}

	public async update(where: ObjectLiteral, partial: Partial<ObjectLiteral>) {
		return db.getRepository('user').update(where, partial);
	}
}

export default new UserService();
