<script>
	import { page } from '$app/state';
	import { createQuery, QueryObserver } from '@tanstack/svelte-query';
	import lookupUser from '$lib/api/lookupUser.js';
	import Https from '$lib/https.js';
	import queryClient from '$lib/queryClient.js';
	import Loading from '$lib/components/Loading.svelte';
	import Error from '$lib/components/Error.svelte';

	let username = $state(page.params?.username ?? '');

	let error = $state('');
	let values = $state({
		avatar: undefined,
		displayName: undefined,
		prompt: undefined,
		acceptingAsks: true,
		showResponses: true
	});

	const query = createQuery({
		queryKey: ['user_' + username],
		retry: false,
		queryFn: async () => await lookupUser(username)
	});

	function updateValue(data) {
		values = data ?? values;
	}

	updateValue($query.data);

	async function submit() {
		console.log($query.data);

		await Https.patch('/api/v1/user/' + $query.data.id, values).catch(
			(err) => {
				error = err?.message ?? 'Something went wrong';
			}
		);

		await $query.refetch().then((e) => {
			updateValue(e.data);
		});
	}
</script>

<svelte:head>
	{#if $query.isSuccess}
		<title>Editing @{$query.data.username}'s profile</title>
	{/if}
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
	{#if $query.data}
		<div class="form">
			<div class="inner wide">
				<p class="title">Editing @{$query.data.username}'s profile</p>

				{#if error.length > 0}
					<div class="error">
						<p>{error}</p>
					</div>
				{/if}

				<label for="user_edit_avatar">Avatar</label>
				<input
					class="ipt"
					id="user_edit_avatar"
					placeholder="https://example.com/files/cool_image.png"
					bind:value={values.avatar}
				/>

				<label for="user_edit_displayName">Display name</label>
				<input
					class="ipt"
					id="user_edit_displayName"
					placeholder="cool and awesome"
					bind:value={values.displayName}
				/>

				<label for="user_edit_prompt">Prompt</label>
				<textarea
					class="ipt"
					id="user_edit_prompt"
					placeholder="Ask me anything!"
					bind:value={values.prompt}
				></textarea>

				<div class="check">
					<input
						type="checkbox"
						id="user_edit_acceptingAsks"
						bind:checked={values.acceptingAsks}
					/>
					<label for="user_edit_acceptingAsks">Accept asks</label>
				</div>

				<div class="check">
					<input
						type="checkbox"
						id="user_edit_showResponses"
						bind:checked={values.showResponses}
					/>
					<label for="user_edit_showResponses"
						>Show responses to asks</label
					>
				</div>

				<button class={'btn'} onclick={() => submit()}>Submit</button>
			</div>
		</div>
	{/if}
{/if}

<style lang="scss" global>
</style>
