import { ObjectLiteral } from 'typeorm';

class AskAtomRenderer {
	public async build(object: ObjectLiteral) {
		let xml = '';

		let pageTitle = `"${object.content}" - ${object?.nickname || object?.nickname?.length > 0 ? object.nickname : 'Anonymous'}`;

		// prettier-ignore
		{
			xml += '<entry>';
				xml += `<title>${pageTitle}</title>`;
				xml += `<link rel="self" href="/ask/${object.id}" />`;
				xml += `<id>askjs:ask:aidxw:${object.id}</id>`;
				xml += `<published>${object.createdAt}</published>`;
				xml += `<content>`;
					xml += `${object.response}`;
				xml += `</content>`;
				xml += `<askjs:nickname>${object.nickname ?? 'Anonymous'}</askjs:nickname>`;
				xml += `<askjs:ask>${object.content}</askjs:ask>`;
				xml += `<askjs:response>${object.response}</askjs:response>`;
			xml += '</entry>';
		}

		return xml;
	}

	public async buildMany(objects: ObjectLiteral[]) {
		let built: string[] = [];

		for (const object of objects) {
			await this.build(object).then((e) => {
				if (e) built.push(e);
			});
		}

		return built;
	}
}

export default new AskAtomRenderer();
