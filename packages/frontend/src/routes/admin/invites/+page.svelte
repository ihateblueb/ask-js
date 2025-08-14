<script>
	import { IconPlus, IconTrash } from '@tabler/icons-svelte';
	import generateInvite from '$lib/api/generateInvite.js';
	import { createInfiniteQuery } from '@tanstack/svelte-query';
	import getInvites from '$lib/api/getInvites.js';
	import AskAndResponse from '$lib/components/AskAndResponse.svelte';
	import deleteInvite from '$lib/api/deleteInvite.js';
	import Loading from '$lib/components/Loading.svelte';
	import Error from '$lib/components/Error.svelte';

	let query = createInfiniteQuery({
		queryKey: ['admin_invites'],
		retry: false,
		queryFn: async ({ pageParam }) => await getInvites(pageParam),
		initialPageParam: undefined,
		getNextPageParam: (lastPage) => {
			console.log(
				'[admin_invites] lastTlObj',
				lastPage?.at(-1).createdAt
			);
			return lastPage ? lastPage.at(-1).createdAt : undefined;
		}
	});

	function generate() {
		generateInvite().then(() => $query.refetch());
	}

	function del(id) {
		deleteInvite(id).then(() => $query.refetch());
	}
</script>

<div class="adminHeader">
	<div class="left">
		<h2>Invites</h2>
	</div>
	<div class="right">
		<button class="btn nav accent" onclick={() => generate()}>
			<IconPlus size="18px" />
			Add
		</button>
	</div>
</div>

{#if $query.isLoading}
	<Loading />
{:else if $query.isError}
	<Error
		status={$query.error.status}
		message={$query.error.message}
		server={Boolean($query.error.status)}
		retry={() => $query.refetch()}
	/>
{:else if $query.isSuccess}
	<div class="tl">
		{#each $query.data.pages as results}
			{#each results as data}
				<div class="invite">
					<div class="left">
						<p>{data.code}</p>
					</div>
					<div class="right">
						{#if data.usedBy}
							<p>
								Used by <a href={'/@' + data.usedBy?.username}
									>@{data.usedBy?.username}</a
								>
							</p>
						{:else}
							<p>Unused</p>

							<button
								class="btn nav danger"
								onclick={() => del(data.id)}
							>
								<IconTrash size="18px" />
								Delete
							</button>
						{/if}
					</div>
				</div>
			{/each}
		{/each}
	</div>
{/if}

<style lang="scss" scoped>
	.invite {
		display: flex;
		align-items: center;
		gap: 10px;

		padding: 8px 12px;
		border-radius: 10px;
		background: var(--bg-2);

		.left,
		.right {
			display: flex;
			align-items: center;
		}

		.left {
			flex-wrap: wrap;
			word-break: break-all;
		}

		.right {
			justify-content: flex-end;
			flex-grow: 1;
			gap: 10px;
		}
	}
</style>
