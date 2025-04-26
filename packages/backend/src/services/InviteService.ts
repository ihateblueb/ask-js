import crypto from 'crypto';
import { ObjectLiteral } from 'typeorm';
import IdService from './IdService.js';
import db from '../utils/db.js';

class UserService {
	public async get(where: ObjectLiteral) {
		return await db.getRepository('invite').findOne({ where: where });
	}

	public async getMany(where: ObjectLiteral, order?: string, take?: number) {
		return await db
			.getRepository('invite')
			.createQueryBuilder('invite')
			.leftJoinAndSelect('invite.usedBy', 'usedBy')
			.where(where)
			.orderBy(order, 'DESC')
			.take(take ?? 45)
			.getMany();
	}

	public async create(creatorId: string) {
		let invite = {
			id: IdService.generate(),
			used: false,
			code: crypto.randomBytes(16).toString('hex'),
			creator: creatorId,
			createdAt: new Date().toISOString()
		};

		await db.getRepository('invite').insert(invite);
		return this.get({ id: invite.id });
	}

	public async delete(where: ObjectLiteral) {
		return await db.getRepository('invite').delete(where);
	}
}

export default new UserService();
