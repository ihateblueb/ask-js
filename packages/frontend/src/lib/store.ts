import { writable, type Writable } from 'svelte/store';

const activeRequests = writable(0);
const unreadNotifications = writable(0);

class Store {
	public activeRequests = activeRequests;
	public unreadNotifications = unreadNotifications;
}

export default new Store();
