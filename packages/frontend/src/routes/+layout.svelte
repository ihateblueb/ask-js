<script>
	import { page } from '$app/state';
	import { createQuery, QueryClientProvider } from '@tanstack/svelte-query';
	import queryClient from '$lib/queryClient.js';
	import Avatar from '$lib/components/Avatar.svelte';
	import {
		IconBell,
		IconDashboard,
		IconInbox,
		IconLogout
	} from '@tabler/icons-svelte';
	import Tab from '$lib/components/Tab.svelte';
	import store from '$lib/store.js';
	import parsedLocalStore from '$lib/parsedLocalStore.js';

	let count = $state(0);
	let name = $state(`${page.url.host}`);

	if (parsedLocalStore.meta?.title !== undefined) name = parsedLocalStore.meta.title

	let selfParsed = parsedLocalStore.self;
	let metaParsed = parsedLocalStore.meta;

	let unreadNotifications = $state(0);

	store.unreadNotifications.subscribe((e) => {
		unreadNotifications = e;
		console.log('[unreadNotifications]', e);
	});
</script>

<QueryClientProvider client={queryClient}>
	<div class="page">
		<header>
			<div class="inner">
				<div class="left">
					<a class="subtle" href="/">
						{name}
					</a>
				</div>
				{#if count > 9}
					<div>
						<a href="steam://launch/220/dialog">
							<img src="/gordon.webp" height="50px" />
						</a>
					</div>
				{/if}
				<div class="right">
					{#if selfParsed}
						<div class="btnCtn wideGap">
							<div class="btnCtn noGap">
								{#key page.url.pathname}
									{#if selfParsed.admin}
										<Tab
											collapsable
											href={'/admin'}
											selected={page.url.pathname.startsWith(
												'/admin'
											)}
										>
											<IconDashboard size="18px" />
											Admin
										</Tab>
									{/if}
									<Tab
										collapsable
										href={'/inbox'}
										selected={page.url.pathname ===
											'/inbox'}
									>
										<IconInbox size="18px" />
										Inbox
									</Tab>
									<Tab
										collapsable
										href={'/notifications'}
										selected={page.url.pathname ===
											'/notifications'}
										count={unreadNotifications}
									>
										<IconBell size="18px" />
										Notifications
									</Tab>
								{/key}
							</div>

							<Avatar user={selfParsed} />

							<a class="btn nav nobg danger" href={'/logout'}>
								<IconLogout size="18px" />
							</a>
						</div>
					{:else}
						<div class="btnCtn">
							<a class="btn accent" href="/login"> Login </a>
							<a class="btn nav" href="/register"> Register </a>
						</div>
					{/if}
				</div>
			</div>
		</header>
		<main>
			<div class="inner">
				<slot></slot>
			</div>
		</main>
		<footer>
			<p>
				<b>AskJS</b>{metaParsed?.version
					? ' v' + metaParsed?.version
					: ''} &bull;
				<a href="https://github.com/ihateblueb/ask-js">Source</a>
				<span role="button" tabindex="0" onclick={() => count++}
					>&bull;</span
				>
				<a href="https://github.com/ihateblueb/ask-js/issues/new"
					>Report issue</a
				>
			</p>
		</footer>
	</div>
</QueryClientProvider>

<style lang="scss" global>
	@use '../app.scss';
</style>
