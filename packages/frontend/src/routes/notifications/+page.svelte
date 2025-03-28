<script>
	import {
		createInfiniteQuery,
		createMutation,
		createQuery
	} from '@tanstack/svelte-query';
	import Loading from '$lib/components/Loading.svelte';
	import Error from '$lib/components/Error.svelte';
	import getNotifications from '$lib/api/getNotifications.js';
	import {
		IconArrowBackUp,
		IconCheck,
		IconChecks,
		IconMailQuestion,
		IconMessage,
		IconMessage2Question,
		IconMessageQuestion,
		IconQuestionMark
	} from '@tabler/icons-svelte';
	import readNotifications from '$lib/api/readNotifications.js';
	import store from '$lib/store';

	const query = createInfiniteQuery({
		queryKey: ['user_notifications'],
		retry: false,
		queryFn: async ({ pageParam }) =>
			await getNotifications(pageParam, true).then(async (e) => {
				updateCount(e);
				return e;
			}),
		initialPageParam: undefined,
		getNextPageParam: (lastPage) => {
			console.log(
				'[user_notifications] lastTlObj',
				lastPage?.at(-1).createdAt
			);
			return lastPage ? lastPage.at(-1).createdAt : undefined;
		}
	});

	function infiniteLoading(e) {
		const observer = new IntersectionObserver(async (entries) => {
			if (entries[0].isIntersecting) $query.fetchNextPage();
		});

		observer.observe(e);
	}

	function updateCount(e) {
		let data = e ?? $query.data?.pages[0];
		if (data) {
			console.log('n/+p beep', data.filter((e) => !e.read).length);
			store.unreadNotifications.set(
				data.filter((e) => !e.read).length ?? 0
			);
		}
	}
</script>

<svelte:head>
	<title>Notifications</title>
</svelte:head>

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
		<div class="header">
			<h2>Notifications</h2>
			<button
				class="btn"
				onclick={() => {
					readNotifications().then(() => {
						$query.refetch().then(() => {
							updateCount();
						});
					});
				}}
			>
				<IconChecks size="18px" />
				Mark read
			</button>
		</div>

		{#each $query.data.pages as results}
			{#each results as object}
				{#snippet header(object)}
					{#if object.type === 'ask'}
						<IconMessage size="18px" />
						<p>New ask</p>
					{:else if object.type === 'comment'}
						<IconArrowBackUp size="18px" />
						<p>
							<a
								class="subtle"
								href={'/@' + object.comment.user.username}
								>{object.comment.user.displayName ??
									object.comment.user.username}</a
							>
							<span dir="ltr"> commented on your response</span>
						</p>
					{/if}

					{#if !object.read}
						<span class="unread" title="Unread"> </span>
					{/if}
				{/snippet}
				{#snippet body(object)}
					{#if object.type === 'ask'}
						<p>{@html object.ask.content}</p>
					{:else if object.type === 'comment'}
						<p>{@html object.comment.content}</p>
					{/if}
				{/snippet}
				{#snippet action(object)}
					{#if object.type === 'ask'}
						<a class="btn tertiary" href="/inbox"> Open Inbox </a>
					{:else if object.type === 'comment'}
						<a
							class="btn tertiary"
							href={'/ask/' + object.comment.commentingOn.id}
						>
							Open Ask
						</a>
					{/if}
				{/snippet}

				<div class="notification">
					<div class="header">
						{@render header(object)}
					</div>
					<div class="body">
						{@render body(object)}
					</div>
					<div class="action">
						{@render action(object)}
					</div>
				</div>
			{/each}
		{/each}

		<div class="fetchMore">
			<div use:infiniteLoading></div>
			{#if $query.hasNextPage}
				<Loading size="var(--fs-lg)" massive={false} />
			{:else}
				<p class="nomore">No more</p>
			{/if}
		</div>
	</div>
{/if}

<style lang="scss" scoped>
	.notification {
		display: flex;
		flex-direction: column;

		background: var(--bg-2);
		color: var(--tx-2);

		gap: 10px;
		padding: 10px;
		border-radius: 7px;
		overflow: clip;

		.header {
			display: flex;
			align-items: center;
			gap: 10px;
			margin: 0;

			p {
				a {
					font-weight: bold;
					word-break: break-all;
				}
			}

			.unread {
				display: flex;
				justify-content: flex-end;
				align-items: flex-end;

				height: 10px;
				width: 10px;
				background-color: var(--ac-1);
				border-radius: 99px;
			}
		}

		.body {
			// 10px gap, 18px icon
			margin-left: 28px;

			p {
				color: var(--tx-3);
			}
		}

		.action {
			// 10px gap, 18px icon
			margin-left: 28px;

			display: flex;
			gap: 10px;
		}
	}
</style>
