<script>
	import { page } from '$app/state';
	import Error from '$lib/components/Error.svelte';
	import Tab from '$lib/components/Tab.svelte';
	import parsedLocalStore from '$lib/parsedLocalStore';
	import {
		IconDashboard,
		IconMail,
		IconMessage,
		IconSettings,
		IconUsers
	} from '@tabler/icons-svelte';

	let isAdmin = parsedLocalStore.self?.admin ?? false;
</script>

<svelte:head>
	<title>Admin</title>
</svelte:head>

{#if isAdmin}
	<div class="adminTabs">
		<div class="btnCtn noGap wrap">
			{#key page.url.pathname}
				<Tab
					short
					href={'/admin'}
					selected={page.url.pathname === '/admin'}
				>
					<IconDashboard size="18px" />
					Dashboard
				</Tab>
				<Tab
					short
					href={'/admin/invites'}
					selected={page.url.pathname === '/admin/invites'}
				>
					<IconMail size="18px" />
					Invites
				</Tab>
				<Tab
					short
					href={'/admin/users'}
					selected={page.url.pathname === '/admin/users'}
				>
					<IconUsers size="18px" />
					Users
				</Tab>
				<Tab
					short
					href={'/admin/asks'}
					selected={page.url.pathname === '/admin/asks'}
				>
					<IconMessage size="18px" />
					Asks
				</Tab>
			{/key}
		</div>
	</div>
	<hr />

	<div class="adminCtn">
		<slot></slot>
	</div>
{:else}
	<Error
		message="You do not have access to this page."
		retry={() => window.location.reload()}
	/>
{/if}

<style lang="scss" scoped>
	.adminTabs {
		display: flex;
		margin-top: -10px;
	}

	hr {
		border: none;
		border-bottom: 1px solid var(--bg-2);
		width: 150vw;
		margin-top: 0;
		margin-bottom: 25px;
		margin-left: calc(-1 * 50vw);
	}

	.adminCtn {
		margin-top: 10px;
	}
</style>
