import { browser } from '$app/environment';
import Https from '$lib/https.js';
import localStore from '$lib/localStore.js';
import store from '$lib/store.js';
import getNotifications from '$lib/api/getNotifications.js';
import parsedLocalStore from '$lib/parsedLocalStore.js';

export const prerender = false;
export const ssr = false;

if (browser) {
	let selfParsed = parsedLocalStore.self;

	if (selfParsed) {
		Https.get('/api/v1/user/' + selfParsed.id).then((e) => {
			if (e.id !== undefined) {
				localStore.set('self', JSON.stringify(e));
				updateNotificationCount();
			}
		});
	}

	Https.get('/api/v1/meta').then((e) => {
		localStore.set('meta', JSON.stringify(e));
	});
}

function updateNotificationCount() {
	getNotifications().then((e) => {
		store.unreadNotifications.set(e?.length ?? 0);
	});
}
