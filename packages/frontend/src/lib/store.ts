import { writable, type Writable } from 'svelte/store';

const activeRequests = writable(0);
const unreadNotifications = writable(0);
const updateMeta = writable(false);

class Store {
	public activeRequests = activeRequests;
	public unreadNotifications = unreadNotifications;
	public updateMeta = updateMeta;
}

export default new Store();
