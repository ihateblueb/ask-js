import https from '$lib/https';

export default function getAdminAsks(id, since) {
	return https.get(
		`/api/v1/admin/asks` + (since ? '?since=' + since : ''),
		true
	);
}
