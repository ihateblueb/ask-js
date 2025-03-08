import { browser } from '$app/environment';

type localStore = {
	self: any | undefined;
	token: string | undefined;
	meta: any | undefined;
};

let defaults: localStore = {
	self: undefined,
	token: undefined,
	meta: undefined
};

class LocalStore {
	public defaults = defaults;

	public get(key: string) {
		let toReturn;

		if (browser) toReturn = localStorage.getItem('askjs_' + key);

		if (toReturn) {
			return toReturn;
		} else {
			return defaults[key];
		}
	}

	public set(key: string, val: string) {
		if (browser) {
			if (val) {
				localStorage.setItem('askjs_' + key, val);
			} else {
				localStorage.setItem('askjs_' + key, '');
			}
		}

		return;
	}

	public delete(key: string) {
		if (browser) localStorage.removeItem('askjs_' + key);
	}
}

export default new LocalStore();
