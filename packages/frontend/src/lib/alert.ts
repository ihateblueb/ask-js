import store from '$lib/store.js';

export type Alert = {
	id: string;
	type: AlertType;
	message: string;
};

export type AlertType = 'success' | 'warning' | 'danger';

export function createAlert(type: AlertType, message: string) {
	const id = Date.now().toString();
	const alert = {
		id,
		type,
		message
	};

	console.log(`[alert:${alert.type}] ${alert.message}`);

	store.alerts.update((e) => [...e, alert]);

	setTimeout(() => {
		store.alerts.update((e) => [...e.filter((f) => f !== alert)]);
	}, 5000);
}
