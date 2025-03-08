<script>
	import { createQuery } from '@tanstack/svelte-query';
	import lookupUser from '$lib/api/lookupUser.js';
	import getAllUsers from '$lib/api/getAllUsers.js';
	import Avatar from '$lib/components/Avatar.svelte';
	import Loading from '$lib/components/Loading.svelte';
	import Error from '$lib/components/Error.svelte';

	const query = createQuery({
		queryKey: ['userlist'],
		retry: false,
		queryFn: async () => await getAllUsers()
	});
</script>

<svelte:head>
	<title></title>
</svelte:head>

<h2>User directory</h2>

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
	<div class="tl directory">
		{#each $query.data as user}
			<div class="userCard">
				<Avatar {user} size="40" />
				<a class="subtle" href={'/@' + user.username}
					>{user.displayName ?? user.username}<br /><small
						>{'@' + user.username + ''}</small
					></a
				>
			</div>
		{/each}
	</div>
{/if}

<style>
	.directory {
		margin-top: 10px;

		.userCard {
			display: flex;
			align-items: center;
			gap: 10px;

			a {
				width: 100%;

				text-overflow: ellipsis;
				white-space: nowrap;
				overflow: hidden;
			}
		}
	}
</style>
