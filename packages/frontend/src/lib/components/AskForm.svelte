<script>
	import sendAsk from '$lib/api/sendAsk.js';

	let { user } = $props();

	let error = $state('');

	let cw = $state('');
	let content = $state('');
	let nickname = $state('');
	let visibility = $state('public');

	async function submit() {
		await sendAsk(user.id, cw, content, visibility, nickname)
			.then(() => {
				cw = '';
				content = '';
				nickname = '';
				visibility = 'public';
			})
			.catch((err) => {
				error = err?.message ?? 'Something went wrong';
			});
	}
</script>

{#if user.acceptingAsks}
	<div class="form">
		<div class="inner wide">
			{#if error.length > 0}
				<div class="error mb">
					<p>{error}</p>
				</div>
			{/if}

			<input class="ipt" bind:value={cw} placeholder="Content warning" />

			<textarea
				class="ipt"
				bind:value={content}
				required
				placeholder="Question"
			>
			</textarea>

			<input class="ipt" bind:value={nickname} placeholder="Nickname" />

			<div class="visAndSubmit">
				<div class="left">
					<select class="ipt" bind:value={visibility}>
						<option value="public">Public</option>
						<option value="private">Private</option>
					</select>
				</div>

				<button
					class={'btn' + (content.length > 0 ? ' accent' : '')}
					onclick={() => submit()}>Send</button
				>
			</div>
		</div>
	</div>
{:else}
	<h3>Inbox currently closed</h3>
{/if}

<style lang="scss" scoped>
	.visAndSubmit {
		display: flex;
		align-items: center;
		width: 100%;
		gap: 10px;

		.left {
			flex-grow: 1;
		}
	}
</style>
