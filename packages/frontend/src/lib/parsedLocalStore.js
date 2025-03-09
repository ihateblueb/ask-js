import localStore from '$lib/localStore.js';

let selfRaw = localStore.get('self');
let metaRaw = localStore.get('meta');

let selfParsed = undefined;
let metaParsed = undefined;

try {
	selfParsed = JSON.parse(selfRaw);
} catch {}
try {
	metaParsed = JSON.parse(metaRaw);
} catch {}

export default {
	self: selfParsed,
	meta: metaParsed
};
