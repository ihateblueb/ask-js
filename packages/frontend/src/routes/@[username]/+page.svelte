<script>
	import { createQuery } from '@tanstack/svelte-query';
	import lookupUser from '$lib/api/lookupUser.js';
	import AskForm from '$lib/components/AskForm.svelte';
	import UserTimeline from '$lib/components/UserTimeline.svelte';
	import Avatar from '$lib/components/Avatar.svelte';
	import { IconPencil } from '@tabler/icons-svelte';
	import localStore from '$lib/localStore.js';

	let props = $props();
	console.log(props.data);

	const query = createQuery({
		queryKey: ['user_'+props.data.username],
		retry: false,
		queryFn: async () => await lookupUser(props.data.username)
	});

	let selfRaw = localStore.get("self");
	let selfParsed = undefined;

	try {
		selfParsed = JSON.parse(selfRaw);
	} catch { }
</script>

{#if $query.isLoading}
	<p>Loading @{props.data.username}</p>
{:else if $query.isError}
	<p>Error loading @{props.data.username}</p>
{:else if $query.isSuccess}
	<div>
		<div class="prompt">
			<div class="left">
				<Avatar user={$query.data} size={45} />
			</div>
			<div class="right">
				<div class="inner">
					<p>"{#if $query.data?.prompt}{$query.data?.prompt}{:else}<i>No prompt</i>{/if}"</p>
					<i class="username">- {$query.data?.displayName ?? "@"+$query.data.username}</i>
				</div>
			</div>
			<div class="farRight">
				{#if selfParsed && (selfParsed.admin || selfParsed.id === $query.data.id )}
					<a class="btn" href={"/@"+$query.data.username+"/edit"}>
						<IconPencil	size="18px" /> Edit
					</a>
				{/if}
			</div>
		</div>

		<AskForm userId={$query.data.id} />

		<div class="timeline">
			<h2>Asks</h2>
			<UserTimeline userId={$query.data.id} />
		</div>
	</div>
{/if}

<style lang="scss" global>
	.prompt {
		display: flex;
		gap: 10px;

		margin-bottom: 20px;

		.left,.right,.farRight {
			display: flex;
			align-items: flex-start;
			flex-direction: column;
		}

		.left {
			gap: 10px;
		}

		.right {
			.inner {
				padding: 8px 10px;
				background: var(--bg-2);
				color: var(--tx-2);
				border-radius: 6px;

				.username {
					color: var(--tx-3);
				}
			}
		}

		.farRight {
			flex-grow: 1;
			align-items: flex-end;
		}
	}

	.timeline {
		display: flex;
		flex-direction: column;
		gap: 4px;

		margin-top: 20px;

		h2 {
			margin-bottom: 10px;
		}
	}
</style>
