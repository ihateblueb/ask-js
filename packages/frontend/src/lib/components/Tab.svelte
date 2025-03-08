<script>
	import { fly, slide } from 'svelte/transition';

	let {
		selected = false,
		short = false,
		collapsable = false,
		count = 0,
		href = ''
	} = $props();
</script>

{#if href}
	<a
		class={'btn tab' +
			(selected ? ' selected' : '') +
			(short ? ' short' : '') +
			(collapsable ? ' collapsable' : '')}
		{href}
	>
		<slot></slot>
		{#if count > 0}
			<span class="count">
				{count > 9 ? "9+" : count}
			</span>
		{/if}
		<span class="bar" in:slide|global={{ duration: 150, axis: 'x' }}></span>
	</a>
{:else}
	<button
		class={'btn tab' +
			(selected ? ' selected' : '') +
			(short ? ' short' : '') +
			(collapsable ? ' collapsable' : '')}
		on:click
	>
		<slot></slot>
		{#if count > 0}
			<span class="count">
				{count > 9 ? "9+" : count}
			</span>
		{/if}
		<span class="bar" in:slide|global={{ duration: 150, axis: 'x' }}></span>
	</button>
{/if}
