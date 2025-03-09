import https from '$lib/https';

export default function getUserTimeline(id, since) {
	return https.get(
		`/api/v1/timeline/${id}` + (since ? '?since=' + since : ''),
		true
	);
}
