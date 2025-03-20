import { ObjectLiteral } from 'typeorm';
import UserService from '../UserService.js';

class AtomFeedRenderer {
	public async build(userId: string, entries: string[]) {
		const user = await UserService.get({ id: userId });

		let xml = '';

		xml += '<?xml version="1.0" encoding="UTF-8"?>';
		xml +=
			'<feed xmlns="http://www.w3.org/2005/Atom" xmlns:askjs="http://ns.remlit.site/xml/askjs">';

		xml += `<title>${user.displayName ?? user.username}'s Inbox</title>`;
		xml += `<link rel="self" href="/@${user.username}" />`;
		xml += `<id>askjs:user:aidxw:${user.id}</id>`;

		xml += `<author>`;
		xml += `<name>${user.username}</name>`;
		xml += `</author>`;

		for (const entry of entries) {
			xml += entry;
		}

		xml += '</feed>';

		return xml;
	}
}

export default new AtomFeedRenderer();
