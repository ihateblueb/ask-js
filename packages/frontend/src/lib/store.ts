import { writable, type Writable } from 'svelte/store';
import type { Alert } from '$lib/alert.js';

const activeRequests = writable(0);
const unreadNotifications = writable(0);
const updateMeta = writable(false);
const alerts: Writable<Alert[]> = writable([]);

class Store {
	public activeRequests = activeRequests;
	public unreadNotifications = unreadNotifications;
	public updateMeta = updateMeta;
	public alerts = alerts;
}

export default new Store();
