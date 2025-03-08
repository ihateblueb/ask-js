import { ObjectLiteral } from 'typeorm';
import db from '../../utils/db.js';

class AskRenderer {
	public async build(object: ObjectLiteral) {
		object['commentCount'] = await db.getRepository('comment').count({
			where: {
				commentingOnId: object.id
			}
		});

		return object;
	}

	public async buildMany(objects: ObjectLiteral[]) {
		let built: ObjectLiteral[] = [];

		for (const object of objects) {
			await this.build(object).then((e) => {
				if (e) built.push(e);
			});
		}

		return built;
	}
}

export default new AskRenderer();
