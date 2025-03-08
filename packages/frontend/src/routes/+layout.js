import { browser } from '$app/environment';
import Https from '$lib/https.js';
import localStore from '$lib/localStore.js';
import store from '$lib/store.js';
import getNotifications from '$lib/api/getNotifications.js';

export const prerender = false;
export const ssr = false;

if (browser) {
	let selfRaw = localStore.get('self');
	let selfParsed = undefined;

	try {
		selfParsed = JSON.parse(selfRaw);
	} catch {}

	if (selfParsed) {
		Https.get('/api/v1/user/' + selfParsed.id).then((e) => {
			if (e.id !== undefined) {
				localStore.set('self', JSON.stringify(e));
				updateNotificationCount();
			}
		});
	}
}

function updateNotificationCount() {
	getNotifications().then((e) => {
		store.unreadNotifications.set(e?.length ?? 0);
	});
}
