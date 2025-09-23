<script>
	import { page } from '$app/state';
	import Https from '$lib/https.js';
	import {
		IconArrowBackUp, IconChevronDown, IconChevronUp,
		IconCopy, IconGavel,
		IconLock,
		IconTrash,
		IconWorld
	} from '@tabler/icons-svelte';
	import Avatar from '$lib/components/Avatar.svelte';
	import Mfm from '$lib/components/Mfm.svelte';
	import { createAlert } from '$lib/alert.js';

	let {
		data,
		onResponsePage = false,
		onAdminPage = false,
		detailed = false
	} = $props();

	let response = $state('');
	let responseFor = $state('');
	let submittedResponse = $state(false);
	let deleted = $state(false);
	let senderBanned = $state(false);
	let showMore = $state(false);

	function copyAsk() {
		navigator.clipboard
			.writeText(`> ${data.content.replaceAll('\n', '\n> ')}

${submittedResponse ? response : data.response}

${page.url.protocol + '//' + page.url.host + '/ask/' + data.id}`);
		createAlert(
			"success",
			"Copied to clipboard",
		)
	}

	async function deleteAsk() {
		await Https.delete('/api/v1/ask/' + data.id).then(() => {
			deleted = true;
			createAlert(
				"success",
				"Deleted ask"
			)
		});
	}

	async function banSender() {
		await Https.post('/api/v1/ask/' + data.id + '/banSender').then(() => {
			senderBanned = true;
			createAlert(
				"success",
				"Banned sender"
			)
		});
	}

	async function respond() {
		await Https.post('/api/v1/ask/' + data.id + '/respond', {
			response: response
		}).then(() => {
			submittedResponse = true;
			responseFor = data.id;
			createAlert(
				"success",
				"Responded to ask"
			)
		});
	}

	$effect(() => {
		if (data && data.id !== responseFor) {
			submittedResponse = false;
			responseFor = '';
			response = '';
		}
	});
</script>

{#snippet inner()}
	<div class="question">
		<p>
			<Mfm content={data.content} />
		</p>
		<br />
		<small class="time"
			><a href={'/ask/' + data.id}
				>{new Date(data.createdAt).toLocaleDateString()} at {new Date(
					data.createdAt
				).toLocaleTimeString()}</a
			>
			{#if data.visibility === 'private'}<IconLock
					size="16px"
				/>{:else}<IconWorld size="16px" />{/if}</small
		>
		<i class="asker"
			>- {data?.nickname || data?.nickname?.length > 0
				? data?.nickname
				: 'Anonymous'}</i
		>
	</div>
	<div class="response">
		{#if submittedResponse || data.response}
			<p>
				<Mfm content={submittedResponse ? response : data.response} />
			</p>
		{:else if onResponsePage && !submittedResponse}
			<textarea
				class="ipt tertiary"
				style="resize: vertical;"
				bind:value={response}
				placeholder="Write your response..."
				rows="1"
			></textarea>
		{/if}
	</div>
	{#if onResponsePage || onAdminPage}
		<div class="btnCtn padded">
			{#if !data.response && !submittedResponse && !onAdminPage}
				<button class="btn tertiary" onclick={() => respond()}>
					Respond
				</button>
			{/if}
			{#if onAdminPage}
				<div class="to">
					<Avatar user={data.to} />
					<p>
						<small>Asked to</small>
						<a href={'/@' + data.to.username}>@{data.to.username}</a
						>
					</p>
				</div>
			{/if}

			<div class="end">
				<button class="btn tertiary" onclick={() => copyAsk()}>
					<IconCopy size="18px" />
					Copy
				</button>
				<button class="btn tertiary" onclick={() => {
					showMore = !showMore
				}}>
					{#if showMore}
						<IconChevronUp size="18px" />
					{:else}
						<IconChevronDown size="18px" />
					{/if}
				</button>
			</div>
		</div>
	{:else if !detailed}
		<div class="btnCtn padded">
			<a class="btn tertiary" href={'/ask/' + data.id + '#comment'}>
				<IconArrowBackUp size="18px" />
				View Comments ({data.commentCount})
			</a>
		</div>
	{/if}

	{#if showMore}
		<div class="btnCtn padded danger">
			<div class="end">
				<button class="btn danger" onclick={() => deleteAsk()}>
					<IconTrash size="18px" />
					Delete
				</button>
				{#if !senderBanned}
					<button class="btn danger" onclick={() => banSender()}>
						<IconGavel size="18px" />
						Ban Sender
					</button>
				{/if}
			</div>
		</div>
	{/if}
{/snippet}

{#if !deleted}
	<div class="ask">
		{#if data.cw}
			<details>
				<summary>{data.cw}</summary>
				{@render inner()}
			</details>
		{:else}
			{@render inner()}
		{/if}
	</div>
{/if}

<style lang="scss">
	.ask {
		display: flex;
		flex-direction: column;

		background: var(--bg-2);
		color: var(--tx-2);

		border-radius: 10px;
		overflow: clip;
	}

	summary {
		background: var(--bg-3);
		padding: 10px 12px;
		font-size: 14px;
	}

	details:first-of-type summary::marker,
	:is(::-webkit-details-marker) {
		content: '+ ';
		font-weight: 700;
		// same width
		font-family: monospace;
	}
	details[open]:first-of-type summary::marker {
		content: '- ';
	}

	p {
		margin: 0;
	}

	.footer {
		padding: 12px;
		background: var(--bg-3-75);
	}

	.question,
	.response {
		display: flex;
		flex-direction: column;
		gap: 4px;

		padding: 12px;
	}

	.question {
		background: var(--bg-3-75);

		small {
			display: flex;
			align-items: center;
			gap: 5px;

			a {
				color: var(--tx-3);
				text-decoration: none;
				font-size: inherit;

				&:hover {
					text-decoration: underline;
					text-decoration-color: var(--ac-1-50);
				}
			}
		}
	}

	.to {
		display: flex;
		align-items: center;
		gap: 10px;
	}
</style>
