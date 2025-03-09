<script>
	import { createInfiniteQuery, createQuery } from '@tanstack/svelte-query';
	import getMyTimeline from '$lib/api/getMyTimeline.js';
	import AskAndResponse from '$lib/components/AskAndResponse.svelte';
	import Loading from '$lib/components/Loading.svelte';
	import Error from '$lib/components/Error.svelte';
	import parsedLocalStore from '$lib/parsedLocalStore.js';

	let selfParsed = parsedLocalStore.self;

	const query = createInfiniteQuery({
		queryKey: ['user_inbox'],
		retry: false,
		queryFn: async ({ pageParam }) =>
			await getMyTimeline(selfParsed?.id, pageParam),
		initialPageParam: undefined,
		getNextPageParam: (lastPage) => {
			console.log('[user_inbox] lastTlObj', lastPage?.at(-1).createdAt);
			return lastPage ? lastPage.at(-1).createdAt : undefined;
		}
	});

	function infiniteLoading(e) {
		const observer = new IntersectionObserver(async (entries) => {
			if (entries[0].isIntersecting) $query.fetchNextPage();
		});

		observer.observe(e);
	}
</script>

<svelte:head>
	<title>Inbox</title>
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
		<h2>Inbox</h2>
		{#each $query.data.pages as results}
			{#each results as object}
				<AskAndResponse data={object} onResponsePage />
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
