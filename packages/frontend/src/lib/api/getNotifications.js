import https from '$lib/https';

export default function getNotifications(since, read) {
	return https.get(
		`/api/v1/notifications` +
			(since ? '?since=' + since : '') +
			(read && since ? '&read=' + read : read ? '?read=' + read : ''),
		true
	);
}
