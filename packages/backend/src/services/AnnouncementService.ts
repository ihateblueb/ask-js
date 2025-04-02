import { MoreThan, ObjectLiteral } from "typeorm";
import db from '../utils/db.js';
import { AnnouncementType } from "../entities/Announcement.js";
import IdService from "./IdService.js";
import SanitizerService from "./SanitizerService.js";
import LoggerService from "./LoggerService.js";

class AnnouncementService {
	public async get(where: ObjectLiteral) {
		return await db
			.getRepository('announcement')
			.createQueryBuilder('announcement')
			.where(where)
			.getOne();
	}

	public async getMany(where: ObjectLiteral, order?: string, take?: number) {
		return await db
			.getRepository('announcement')
			.createQueryBuilder('announcement')
			.where(where)
			.orderBy(order, 'DESC')
			.take(take ?? 45)
			.getMany();
	}

	public async getValid(order?: string) {
		return await db
			.getRepository('announcement')
			.createQueryBuilder('announcement')
			.where({
                validUntil: MoreThan(new Date().toISOString())
            })
			.orderBy(order, 'DESC')
			.getMany();
	}

    public async create(
        type: string,
        content: string,
        validUntil: string
    ) {
		if (!['urgent', 'warn', 'generic'].includes(type))
			return {
				error: true,
				status: 400,
				message: 'Invalid type'
			};

        if (content.length > 8192) 
            return {
				error: true,
				status: 400,
				message: 'Content too long'
			};

        const id = IdService.generate()

        let announcement = {
            id: id,
            type: type,
            content: SanitizerService.sanitize(content),
            createdAt: new Date().toISOString(),
            validUntil: validUntil 
        }

        LoggerService.debug('created announcement '+announcement.id)

        await db.getRepository('announcement').insert(announcement);

		return {
			error: false,
			status: 200,
			message: 'Announcement created',
			announcement: await this.get({ id: id })
		};
    }

	public async delete(where: ObjectLiteral) {
		return await db.getRepository('ask').delete(where);
	}
}

export default new AnnouncementService()