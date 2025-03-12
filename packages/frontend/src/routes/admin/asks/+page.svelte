<script>
	import { createInfiniteQuery, createQuery } from '@tanstack/svelte-query';
	import Loading from '$lib/components/Loading.svelte';
	import Error from '$lib/components/Error.svelte';
	import AskAndResponse from '$lib/components/AskAndResponse.svelte';
	import getAdminAsks from '$lib/api/getAdminAsks.js';

	const query = createInfiniteQuery({
		queryKey: ['admin_asks'],
		retry: false,
		queryFn: async ({ pageParam }) => await getAdminAsks(pageParam),
		initialPageParam: undefined,
		getNextPageParam: (lastPage) => {
			console.log('[admin_asks] lastTlObj', lastPage?.at(-1).createdAt);
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

<div class="adminHeader">
	<div class="left">
		<h2>Asks</h2>
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
			{#each results as object}
				<AskAndResponse data={object} onAdminPage />
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
