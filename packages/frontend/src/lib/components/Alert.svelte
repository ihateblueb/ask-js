<script>
	import { fly, fade } from 'svelte/transition'
	import { IconAlertTriangle, IconCheck, IconExclamationMark, IconX } from '@tabler/icons-svelte';

	let {
		alert,
	} = $props();
</script>

<div class={"alert " + alert.type} in:fly={{ y: 0, x: 250 }} out:fade={{ duration: 100 }}>
	<div class="icon">
		{#if alert.type === 'success'}
			<IconCheck size="18px" />
		{:else if alert.type === 'warning'}
			<IconExclamationMark size="18px" />
		{:else if alert.type === 'danger'}
			<IconX size="18px" />
		{/if}
	</div>
	<div class="message">
		{alert.message}
	</div>
</div>

<style lang="scss">
	.alert {
		display: flex;
		align-items: center;
		gap: 5px;
		padding: 12px;

		width: 250px;
		border-radius: 8px;
		box-sizing: border-box;

		font-size: 14px;
		backdrop-filter: blur(10px);

		> * {
			display: flex;
			align-items: center;
		}

		&.success {
			color: var(--success-1);
			background: var(--success-1-50);
		}

		&.warning {
			color: var(--warning-1);
			background: var(--warning-1-50);
		}

		&.danger {
			color: var(--danger-1);
			background: var(--danger-1-50);
		}
	}
</style>
