<script>
	import { page } from '$app/state';
	import Tab from '$lib/components/Tab.svelte';
	import {
		IconDashboard,
		IconMail,
		IconSettings,
		IconUsers
	} from '@tabler/icons-svelte';
</script>

<svelte:head>
	<title>Admin</title>
</svelte:head>

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
		{/key}
	</div>
</div>

<div class="adminCtn">
	<slot></slot>
</div>

<style lang="scss" scoped>
	.adminTabs {
		display: flex;

		border-radius: 6px;
		margin-top: -10px;
	}

	.adminCtn {
		margin-top: 10px;
	}
</style>
