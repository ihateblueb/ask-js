import { ObjectLiteral } from 'typeorm';
import UserService from './UserService.js';
import db from '../utils/db.js';
import IdService from './IdService.js';
import SanitizerService from './SanitizerService.js';

class AskService {
	public async get(where: ObjectLiteral) {
		return await db.getRepository('ask').findOne({ where: where });
	}

	public async getMany(where: ObjectLiteral, order?: string, take?: number) {
		return await db
			.getRepository('ask')
			.createQueryBuilder('ask')
			.where(where)
			.orderBy(order, 'DESC')
			.take(take ?? 45)
			.getMany();
	}

	public async create(
		to: string,
		content: string,
		visibility: string,
		cw?: string,
		nickname?: string
	) {
		if (!['public', 'private'].includes(visibility))
			return {
				error: true,
				status: 400,
				message: 'Invalid visibility'
			};

		const toUser = await UserService.get({ id: to });

		if (!toUser)
			return {
				error: true,
				status: 404,
				message: 'User not found'
			};

		const id = IdService.generate();

		const ask = {
			id: id,
			to: SanitizerService.sanitize(to),
			content: SanitizerService.sanitize(content),
			visibility: visibility,
			cw: SanitizerService.sanitize(cw),
			nickname: SanitizerService.sanitize(nickname),
			createdAt: new Date().toISOString()
		};

		await db.getRepository('ask').insert(ask);

		return {
			error: false,
			status: 200,
			message: 'Ask created',
			ask: await this.get({ id: id })
		};
	}

	public async delete(where: ObjectLiteral) {
		return await db.getRepository('ask').delete(where);
	}

	public async respond(id: string, response: string) {
		const ask = await this.get({ id: id });

		if (!ask)
			return {
				error: true,
				status: 404,
				message: 'Ask not found'
			};

		await db.getRepository('ask').update(
			{
				id: id
			},
			{
				response: SanitizerService.sanitize(response)
			}
		);

		return {
			error: false,
			status: 200,
			message: 'Ask responded to',
			ask: await this.get({ id: id })
		};
	}
}

export default new AskService();
