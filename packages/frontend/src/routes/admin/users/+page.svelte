<script>
	import {
		IconBox,
		IconCheck,
		IconCheckbox,
		IconDeviceFloppy,
		IconGavel,
		IconPencil,
		IconPlus,
		IconTrash,
		IconX
	} from '@tabler/icons-svelte';
	import { createQuery } from '@tanstack/svelte-query';
	import getAllUsers from '$lib/api/getAllUsers.js';
	import Avatar from '$lib/components/Avatar.svelte';
	import enableUser from '$lib/api/enableUser.js';
	import disableUser from '$lib/api/disableUser.js';
	import Loading from '$lib/components/Loading.svelte';
	import Error from '$lib/components/Error.svelte';

	let selecting = $state(false);
	let selection = $state([]);

	function toggleSelection(id) {
		if (selection.includes(id)) {
			let index = selection.indexOf(id);
			if (index !== -1) {
				selection.splice(index, 1);
			}
		} else {
			selection.push(id);
		}
	}

	let query = createQuery({
		queryKey: ['admin_users'],
		retry: false,
		queryFn: async () => await getAllUsers()
	});

	function enableUsers() {
		for (const item of selection) {
			enableUser(item).then(() => {
				if (selection.indexOf(item) === selection.length - 1)
					$query.refetch();
			});
		}
	}

	function disableUsers() {
		for (const item of selection) {
			disableUser(item).then(() => {
				if (selection.indexOf(item) === selection.length - 1)
					$query.refetch();
			});
		}
	}
</script>

<div class="adminHeader">
	<div class="left">
		<h2>Users</h2>
	</div>
	<div class="right">
		<button
			class={'btn nav' + (selecting ? ' accent' : '')}
			onclick={() => (selecting = !selecting)}
		>
			<IconCheckbox size="18px" />
			Select
		</button>
		<button class="btn nav accent">
			<IconPlus size="18px" />
			Create
		</button>
	</div>
</div>

{#if selecting}
	<div class="actions">
		<div class="left">
			<p>{selection.length} selected</p>
		</div>
		<div class="right">
			<button class="btn nav" onclick={() => enableUsers()}>
				<IconCheck size="18px" />
				Enable
			</button>
			<button class="btn nav danger" onclick={() => disableUsers()}>
				<IconX size="18px" />
				Disable
			</button>
			<!--
		<button class="btn nav danger">
			<IconTrash size="18px" />
			Delete
		</button>
		-->
		</div>
	</div>
{/if}

{#snippet card(user)}
	<div class="user">
		{#if selecting}
			<input
				type="checkbox"
				checked={selection.includes(user.id)}
				onclick={() => toggleSelection(user.id)}
			/>
		{/if}

		<div class="left">
			<Avatar {user} size="30" />
			<div>
				<p>{user.username ?? user.displayName}</p>
				<p>@{user.username}</p>
			</div>
		</div>
		<div class="right">
			{#if user.admin}
				<p class="flag">Admin</p>
			{/if}
			<p class="flag">
				{#if user.approved}
					Enabled
				{:else}
					Disabled
				{/if}
			</p>

			<a href={'/@' + user.username + '/edit'} class="btn nav tertiary">
				<IconPencil size="18px" />
				Edit
			</a>
		</div>
	</div>
{/snippet}

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
		{#each $query.data as data}
			{@render card(data)}
		{/each}
	</div>
{/if}

<style lang="scss" scoped>
	.actions {
		display: flex;
		align-items: center;
		gap: 5px;
		margin-bottom: 10px;

		padding: 8px 12px;
		border-radius: 6px;
		background: var(--bg-2-50);

		.left,
		.right {
			display: flex;
			align-items: center;
		}

		.right {
			justify-content: flex-end;
			flex-grow: 1;
			gap: 5px;
			flex-wrap: wrap;
		}
	}

	.user {
		display: flex;
		align-items: center;
		gap: 10px;

		padding: 8px 12px;
		border-radius: 6px;
		background: var(--bg-2);

		.left,
		.right {
			display: flex;
			align-items: center;
		}

		.left {
			gap: 10px;

			div {
				display: flex;
				align-items: center;
				gap: 5px;

				:last-child {
					color: var(--tx-3);
				}
			}
		}

		.right {
			justify-content: flex-end;
			flex-grow: 1;
			gap: 10px;
			flex-wrap: wrap;
		}
	}
</style>
