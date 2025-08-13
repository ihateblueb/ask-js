<script>
	import { createQuery } from '@tanstack/svelte-query';
	import lookupUser from '$lib/api/lookupUser.js';
	import getAllUsers from '$lib/api/getAllUsers.js';
	import Avatar from '$lib/components/Avatar.svelte';
	import Loading from '$lib/components/Loading.svelte';
	import Error from '$lib/components/Error.svelte';
	import getMeta from '$lib/api/getMeta.js';
	import {
		IconArrowBackUp,
		IconMessage,
		IconMessageReply,
		IconUser
	} from '@tabler/icons-svelte';

	const query = createQuery({
		queryKey: ['userlist'],
		retry: false,
		queryFn: async () => await getAllUsers()
	});

	const metaQuery = createQuery({
		queryKey: ['meta'],
		retry: false,
		queryFn: async () => await getMeta()
	});
</script>

<svelte:head>
	<title></title>
</svelte:head>

<h2>Server Statistics</h2>

{#if $metaQuery.isLoading}
	<Loading />
{:else if $metaQuery.isError}
	<Error
		status={$metaQuery.error.status}
		message={$metaQuery.error.message}
		server={Boolean($metaQuery.error.status)}
		retry={() => $metaQuery.refetch()}
	/>
{:else if $metaQuery.isSuccess}
	<div class="stats">
		<div class="stat">
			<div class="icon">
				<IconUser size="18px" />
			</div>
			<b>{$metaQuery.data.stats.users}</b> users
		</div>
		<div class="stat">
			<div class="icon">
				<IconMessage size="18px" />
			</div>
			<b>{$metaQuery.data.stats.asks}</b> asks
		</div>
		<div class="stat">
			<div class="icon">
				<IconMessageReply size="18px" />
			</div>
			<b>{$metaQuery.data.stats.responses}</b> responses
		</div>
		<div class="stat">
			<div class="icon">
				<IconArrowBackUp size="18px" />
			</div>
			<b>{$metaQuery.data.stats.comments}</b> comments
		</div>
	</div>
{/if}

<h2>User Directory</h2>

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
	<div class="directory">
		{#each $query.data as user}
			{#if user.approved}
				<div class="userCard">
					<Avatar {user} size="40" />
					<a class="subtle" href={'/@' + user.username}
						>{user.displayName ?? user.username}<br /><small
							>{'@' + user.username + ''}</small
						></a
					>
				</div>
			{/if}
		{/each}
	</div>
{/if}

<style>
	h2 {
		margin-bottom: 15px;
	}

	.stats {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;

		margin-bottom: 20px;

		.stat {
			display: flex;
			align-items: center;
			gap: 5px;

			font-size: 14px;
			background-color: var(--bg-2);

			padding: 16px;
			width: calc(50% - 10px);
			box-sizing: border-box;
			border-radius: 10px;

			.icon {
				display: flex;
				align-items: center;
				margin-right: 2px;
				color: var(--ac-1);

				&::before {
					position: absolute;
					content: '';
					width: 18px;
					height: 18px;
					border-radius: 50%;
					background-color: var(--ac-1-50);
					filter: blur(8px);
				}
			}
		}
	}

	.directory {
		display: flex;
		flex-wrap: wrap;
		gap: 12px;

		.userCard {
			display: flex;
			align-items: center;
			gap: 12px;

			width: calc(50% - 10px);
			box-sizing: border-box;

			@media (max-width: 535px) {
				width: 100%;
			}

			a {
				flex-grow: 1;
				box-sizing: border-box;

				text-overflow: ellipsis;
				white-space: nowrap;
				overflow: hidden;
			}
		}
	}
</style>
