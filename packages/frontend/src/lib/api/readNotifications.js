import https from '$lib/https';

export default function readNotifications(since) {
	return https.post(`/api/v1/notifications/read`, {
		since: since
	});
}
