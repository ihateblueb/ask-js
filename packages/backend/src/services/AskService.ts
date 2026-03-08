import { ObjectLiteral } from 'typeorm';
import UserService from './UserService.js';
import db from '../utils/db.js';
import IdService from './IdService.js';
import SanitizerService from './SanitizerService.js';
import NotificationService from './NotificationService.js';
import LoggerService from './LoggerService.js';

class AskService {
	public async get(where: ObjectLiteral) {
		return await db
			.getRepository('ask')
			.createQueryBuilder('ask')
			.leftJoinAndSelect('ask.to', 'to')
			.where(where)
			.getOne();
	}

	public async getMany(where: ObjectLiteral, order?: string, take?: number) {
		return await db
			.getRepository('ask')
			.createQueryBuilder('ask')
			.leftJoinAndSelect('ask.to', 'to')
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

		if (!toUser.acceptingAsks)
			return {
				error: true,
				status: 403,
				message: 'User not accepting asks'
			};

		const id = IdService.generate();

		const ask = {
			id: id,
			toId: SanitizerService.sanitize(to),
			content: SanitizerService.sanitize(content),
			visibility: visibility,
			cw: SanitizerService.sanitize(cw),
			nickname: SanitizerService.sanitize(nickname),
			createdAt: new Date().toISOString()
		};

		LoggerService.debug('created ask ' + ask.id);

		await db.getRepository('ask').insert(ask);

		await NotificationService.create(
			'ask',
			ask.toId,
			undefined,
			undefined,
			id
		);

		return {
			error: false,
			status: 200,
			message: 'Ask created',
			ask: await this.get({ id: id })
		};
	}

	public async delete(where: ObjectLiteral) {
		const ask = await this.get(where);

		if (!ask)
			return {
				error: true,
				status: 404,
				message: 'Ask not found'
			};

		await db.getRepository('ask').delete({ id: ask.id });
		await db.getRepository('ask_mod_info').delete({ id: ask.id });

		return {
			error: false,
			status: 200,
			message: 'Ask deleted'
		};
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

		await db.getRepository('notification').update(
			{
				ask: { id: id }
			},
			{
				read: true
			}
		);

		LoggerService.debug('responded to ask ' + ask.id);

		return {
			error: false,
			status: 200,
			message: 'Ask responded to',
			ask: await this.get({ id: id })
		};
	}

	public async createModRecord(id: string, ip: string, userId?: string) {
		return await db.getRepository('ask_mod_info').insert({
			id: id,
			ip: ip,
			userId: userId
		});
	}

	public async getModRecord(where: ObjectLiteral) {
		return await db
			.getRepository('ask_mod_info')
			.createQueryBuilder('ask_mod_info')
			.where(where)
			.getOne();
	}

	public async getManyModRecords(
		where: ObjectLiteral,
		order?: string,
		take?: number
	) {
		return await db
			.getRepository('ask_mod_info')
			.createQueryBuilder('ask_mod_info')
			.where(where)
			.orderBy(order, 'DESC')
			.take(take ?? 45)
			.getMany();
	}

	public async banSender(id: string) {
		const ask = await this.get({ id: id });
		const modRec = await this.getModRecord({ id: id });

		if (ask === undefined)
			return {
				error: true,
				status: 404,
				message: 'Ask not found'
			};

		if (modRec === undefined)
			return {
				error: true,
				status: 404,
				message: 'No mod record found'
			};

		await db.getRepository('banned_sender').insert({
			id: IdService.generate(),
			to: { id: ask.to.id },
			ip: modRec.ip,
			user: { id: modRec.userId }
		});

		return {
			error: false,
			status: 200,
			message: 'Sender banned'
		};
	}

	public async isSenderBanned(
		to: string,
		ip: string,
		userId?: string
	): Promise<boolean> {
		const user = UserService.get({ id: to });

		if (!user) return false;

		const banIp = await db
			.getRepository('banned_sender')
			.createQueryBuilder('banned_sender')
			.where({ ip: ip })
			.getOne();

		const banUser = await db
			.getRepository('banned_sender')
			.createQueryBuilder('banned_sender')
			.where({ userId: userId })
			.getOne();

		if (banIp || banUser) return true;
		return false;
	}
}

export default new AskService();
