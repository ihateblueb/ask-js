<!-- https://github.com/ihateblueb/aster/blob/main/packages/frontend/src/lib/components/Mfm.svelte -->

<script lang="ts">
	import * as mfm from 'mfm-js';

	let { content, simple = false, emojis = undefined } = $props();

	function treeGetter() {
		let mfmTree;

		if (simple) {
			mfmTree = mfm.parseSimple(content);
		} else {
			mfmTree = mfm.parse(content);
		}

		console.debug('[Mfm Tree]', mfmTree);

		return mfmTree;
	}
</script>

{#snippet renderChild(object)}
	{#if object.type === 'text'}
		{@html object.props.text.replace(/(\r\n|\n|\r)/g, '\n')}
	{:else if object.type === 'link'}
		<a href={object.props.url ?? '#'}>
			{@render renderChildren(object.children)}
		</a>
	{:else if object.type === 'bold'}
		<b>
			{@render renderChildren(object.children)}
		</b>
	{:else if object.type === 'strike'}
		<s>
			{@render renderChildren(object.children)}
		</s>
	{:else if object.type === 'italic'}
		<i>
			{@render renderChildren(object.children)}
		</i>
	{:else if object.type === 'plain'}
		<span style="display: inline-block;">
			{@render renderChildren(object.children)}
		</span>
	{:else if object.type === 'small'}
		<small>
			{@render renderChildren(object.children)}
		</small>
	{:else if object.type === 'center'}
		<div style="text-align: center;">
			{@render renderChildren(object.children)}
		</div>
	{:else if object.type === 'url'}
		<a href={object.props.url} rel="nofollow noopener">
			{object.props.url}
		</a>
	{:else if object.type === 'url'}
		<a href={object.props.url} rel="nofollow noopener">
			{@render renderChildren(object.children)}
		</a>
	{:else if object.type === 'quote'}
		<blockquote class="mfm-quote">
			{@render renderChildren(object.children)}
		</blockquote>
	{:else if object.type === 'emojiCode'}
		{@const foundEmoji = emojis
			? emojis.find((e) => e.shortcode === object.props.name)
			: undefined}

		{#if foundEmoji}
			<!-- svelte-ignore a11y_missing_attribute -->
			<img
				class="mfm-customEmoji"
				src={foundEmoji.file.src}
				title=":{foundEmoji.shortcode}:"
			/>
		{:else}
			<span class="mfm-customEmoji">
				:{object.props.name}:
			</span>
		{/if}
	{:else if object.type === 'unicodeEmoji'}
		{object.props.emoji}
	{:else if object.type === 'mention'}
		<div style="display: inline-block;">
			<a href={'/' + object.props.acct}>
				{object.props.acct}
			</a>
		</div>
	{:else if object.type === 'hashtag'}
		<a href={'/tag/' + object.props.hashtag}>#{object.props.hashtag}</a>
	{:else if object.type === 'inlineCode'}
		<code class="mfm-inlineCode">{object.props.code}</code>
	{:else if object.type === 'blockCode'}
		<div class="mfm-blockCode">{object.props.code}</div>
	{:else if object.type === 'fn'}
		{#if object.props.name === 'tada'}
			{@const speed = object.props.args.speed ?? '1s'}
			{@const delay = object.props.args.delay ?? '0s'}
			{@const loop = object.props.args.loop ?? 'infinite'}

			<span
				style={'display: inline-block; animation: mfm-tada ' +
					speed +
					' linear ' +
					loop +
					'; animation-delay: ' +
					delay +
					'; font-size: 150%;'}
			>
				{@render renderChildren(object.children)}
			</span>
		{:else if object.props.name === 'jelly'}
			{@const speed = object.props.args.speed ?? '1s'}
			{@const delay = object.props.args.delay ?? '0s'}
			{@const loop = object.props.args.loop ?? 'infinite'}

			<span
				style={'display: inline-block; animation: mfm-jelly ' +
					speed +
					' linear ' +
					loop +
					'; animation-delay: ' +
					delay}
			>
				{@render renderChildren(object.children)}
			</span>
		{:else if object.props.name === 'twitch'}
			{@const speed = object.props.args.speed ?? '1s'}
			{@const delay = object.props.args.delay ?? '0s'}
			{@const loop = object.props.args.loop ?? 'infinite'}

			<span
				style={'display: inline-block; animation: mfm-twitch ' +
					speed +
					' linear ' +
					loop +
					'; animation-delay: ' +
					delay}
			>
				{@render renderChildren(object.children)}
			</span>
		{:else if object.props.name === 'shake'}
			{@const speed = object.props.args.speed ?? '1s'}
			{@const delay = object.props.args.delay ?? '0s'}
			{@const loop = object.props.args.loop ?? 'infinite'}

			<span
				style={'display: inline-block; animation: mfm-shake ' +
					speed +
					' linear ' +
					loop +
					'; animation-delay: ' +
					delay}
			>
				{@render renderChildren(object.children)}
			</span>
		{:else if object.props.name === 'spin'}
			{@const speed = object.props.args.speed ?? '1s'}
			{@const delay = object.props.args.delay ?? '0s'}
			{@const loop = object.props.args.loop ?? 'infinite'}

			{@const direction = object.props.args.left
				? 'reverse'
				: object.props.args.alternate
					? 'alternate'
					: 'normal'}
			{@const animation = object.props.args.x
				? 'mfm-spinX'
				: object.props.args.y
					? 'mfm-spinY'
					: 'mfm-spin'}

			<span
				style={'display: inline-block; animation: ' +
					animation +
					' ' +
					speed +
					' linear ' +
					loop +
					'; animation-delay: ' +
					delay +
					'; animation-direction: ' +
					direction}
			>
				{@render renderChildren(object.children)}
			</span>
		{:else if object.props.name === 'jump'}
			{@const speed = object.props.args.speed ?? '1s'}
			{@const delay = object.props.args.delay ?? '0s'}
			{@const loop = object.props.args.loop ?? 'infinite'}

			<span
				style={'display: inline-block; animation: mfm-jump ' +
					speed +
					' linear ' +
					loop +
					'; animation-delay: ' +
					delay}
			>
				{@render renderChildren(object.children)}
			</span>
		{:else if object.props.name === 'bounce'}
			{@const speed = object.props.args.speed ?? '1s'}
			{@const delay = object.props.args.delay ?? '0s'}
			{@const loop = object.props.args.loop ?? 'infinite'}

			<span
				style={'display: inline-block; animation: mfm-bounce ' +
					speed +
					' linear ' +
					loop +
					'; animation-delay: ' +
					delay}
			>
				{@render renderChildren(object.children)}
			</span>
		{:else if object.props.name === 'fade'}
			{@const speed = object.props.args.speed ?? '1s'}
			{@const delay = object.props.args.delay ?? '0s'}
			{@const loop = object.props.args.loop ?? 'infinite'}

			<span
				style={'display: inline-block; animation: mfm-fade ' +
					speed +
					' linear ' +
					loop +
					'; animation-delay: ' +
					delay}
			>
				{@render renderChildren(object.children)}
			</span>
		{:else if object.props.name === 'flip'}
			{@const transform =
				object.props.args.h && object.props.args.v
					? 'scaleX(-1,-1)'
					: object.props.args.v
						? 'scaleX(-1)'
						: 'scaleX(-1)'}

			<span
				style={'display: inline-block; transform: ' + transform + ';'}
			>
				{@render renderChildren(object.children)}
			</span>
		{:else if object.props.name === 'flip'}
			{@const transform =
				object.props.args.h && object.props.args.v
					? 'scaleX(-1,-1)'
					: object.props.args.v
						? 'scaleX(-1)'
						: 'scaleX(-1)'}

			<span
				style={'display: inline-block; transform: ' + transform + ';'}
			>
				{@render renderChildren(object.children)}
			</span>
		{:else if object.props.name === 'x2'}
			<span class="mfm-x2" style="display: inline-block;">
				{@render renderChildren(object.children)}
			</span>
		{:else if object.props.name === 'x3'}
			<span class="mfm-x3" style="display: inline-block;">
				{@render renderChildren(object.children)}
			</span>
		{:else if object.props.name === 'x4'}
			<span class="mfm-x4" style="display: inline-block;">
				{@render renderChildren(object.children)}
			</span>
		{:else if object.props.name === 'font'}
			{@const font = object.props.args.serif
				? 'serif'
				: object.props.args.monospace || object.props.args.mono
					? 'monospace'
					: object.props.args.system
						? 'system-ui'
						: object.props.args.sans
							? 'sans'
							: object.props.args.curvie
								? 'cursive'
								: object.props.args.fantasy
									? 'fantasy'
									: object.props.args.emoji
										? 'emoji'
										: object.props.args.math
											? 'math'
											: 'var(--font)'}

			<span style={'display: inline-block; font-family: ' + font + ';'}>
				{@render renderChildren(object.children)}
			</span>
		{:else if object.props.name === 'blur'}
			<span class="mfm-blur" style="display: inline-block;">
				{@render renderChildren(object.children)}
			</span>
		{:else if object.props.name === 'rainbow'}
			{@const speed = object.props.args.speed ?? '1s'}
			{@const delay = object.props.args.delay ?? '0s'}
			{@const loop = object.props.args.loop ?? 'infinite'}

			<span
				style={'display: inline-block; animation: mfm-rainbow ' +
					speed +
					' linear ' +
					loop +
					'; animation-delay: ' +
					delay}
			>
				{@render renderChildren(object.children)}
			</span>
		{:else if object.props.name === 'sparkle'}
			<!-- todo: sparkles -->
			<span style="display: inline-block;">
				{@render renderChildren(object.children)}
			</span>
		{:else if object.props.name === 'rotate'}
			{@const degrees = object.props.args.deg ?? '90'}

			<span
				style={'display: inline-block; transform: rotate(' +
					degrees +
					'deg);'}
			>
				{@render renderChildren(object.children)}
			</span>
		{:else if object.props.name === 'position'}
			{@const x = object.props.args.x ?? '0'}
			{@const y = object.props.args.y ?? '0'}

			<span
				style={'display: inline-block; transform: translateX(' +
					x +
					'em) translateY(' +
					y +
					'em);'}
			>
				{@render renderChildren(object.children)}
			</span>
		{:else if object.props.name === 'scale'}
			{@const x = object.props.args.x ?? '0'}
			{@const y = object.props.args.y ?? '0'}

			<span
				style={'display: inline-block; transform: scale(' +
					x +
					',' +
					y +
					');'}
			>
				{@render renderChildren(object.children)}
			</span>
		{:else if object.props.name === 'fg'}
			{@const color = object.props.args.color ?? 'f00'}

			<span style={'display: inline-block; color: #' + color + ';'}>
				{@render renderChildren(object.children)}
			</span>
		{:else if object.props.name === 'bg'}
			{@const color = object.props.args.color ?? 'f00'}

			<span
				style={'display: inline-block; background-color: #' +
					color +
					';'}
			>
				{@render renderChildren(object.children)}
			</span>
		{:else if object.props.name === 'border'}
			{@const color = object.props.args.color ?? 'var(--accent)'}
			{@const style = object.props.args.style ?? 'solid'}
			{@const width = object.props.args.width ?? '1'}
			{@const radius = object.props.args.radius ?? '0'}
			{@const noclip = object.props.args.noclip ? 'overflow: clip;' : ''}

			<span
				style={'display: inline-block; border: ' +
					width +
					'px ' +
					style +
					' ' +
					color +
					';' +
					noclip}
			>
				{@render renderChildren(object.children)}
			</span>
		{:else if object.props.name === 'plain'}
			<span style="display: inline-block;">
				{@render renderChildren(object.children)}
			</span>
		{:else if object.props.name === 'small'}
			<small>
				{@render renderChildren(object.children)}
			</small>
		{:else if object.props.name === 'center'}
			<div style="text-align: center;">
				{@render renderChildren(object.children)}
			</div>
		{:else}
			{@render renderChildren(object.children)}
		{/if}
	{:else}
		{@render renderChildren(object.children)}
	{/if}
{/snippet}

{#snippet renderChildren(children)}
	{#each children as child}
		{@render renderChild(child)}
	{/each}
{/snippet}

{#snippet renderTree()}
	{@const tree = treeGetter()}
	{#each tree as object}
		{@render renderChild(object)}
	{/each}
{/snippet}

<span class={'mfm' + (simple ? ' simple' : '')}>
	{#if content}
		{@render renderTree()}
	{:else}
		<p></p>
	{/if}
</span>

<style lang="scss" global>
	.mfm {
		display: block;
		overflow-wrap: break-word;
		position: relative;
		white-space: preserve;
		text-wrap-mode: wrap;
		white-space-collapse: preserve;
		line-height: 1.35rem;
		unicode-bidi: isolate;

		&.simple {
			display: inline;
			line-height: normal;

			.mfm-customEmoji {
				height: 1.4rem !important;
			}
		}

		.mfm-emoji {
			display: inline;
			vertical-align: middle;
			height: 1.2rem;
			transition: 0.1s;

			&:hover {
				transform: scale(1.2);
			}
		}

		.mfm-quote,
		blockquote {
			margin: 8px 0;

			color: var(--tx-2);
			border-left: 2px solid var(--tx-3);
			background-color: var(--bg-4-25);
			opacity: 75%;

			border-radius: var(--br-xs);
			padding: 4px 0 4px 10px;
		}

		.mfm-blur {
			filter: blur(7px);
			transition: 0.1s;

			&:hover {
				filter: blur(0px);
			}
		}

		.mfm-x2 {
			font-size: 200%;
		}

		.mfm-x3 {
			font-size: 300%;
		}

		.mfm-x4 {
			font-size: 400%;
		}

		.mfm-inlineCode {
			font-size: var(--fs-sm);
		}

		.mfm-customEmoji {
			display: inline;
			vertical-align: middle;
			height: 2em;
			transition: 0.1s;

			&:hover {
				transform: scale(1.2);
			}
		}

		.mfm-blockCode {
			display: block;
			overflow-wrap: anywhere;
			background: var(--bg-3);
			padding: 8px 12px;
			margin: 5px 0px;
			overflow: auto;
			border-radius: var(--br-md);
			font-family: monospace;
			font-size: var(--fs-sm);
		}

		.mfm-rainbow {
			background-image: linear-gradient(
					to right,
					rgb(255, 0, 0) 0%,
					rgb(255, 165, 0) 17%,
					rgb(255, 255, 0) 33%,
					rgb(0, 255, 0) 50%,
					rgb(0, 255, 255) 67%,
					rgb(0, 0, 255) 83%,
					rgb(255, 0, 255) 100%
			);
			-webkit-background-clip: text;
			background-clip: text;
			color: transparent;
		}

		.mfm-mention {
			display: inline-flex;

			&:hover {
				text-decoration: underline;
			}
		}
	}

	@keyframes mfm-spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}

	@keyframes mfm-spinX {
		0% {
			transform: perspective(128px) rotateX(0deg);
		}
		100% {
			transform: perspective(128px) rotateX(360deg);
		}
	}

	@keyframes mfm-spinY {
		0% {
			transform: perspective(128px) rotateY(0deg);
		}
		100% {
			transform: perspective(128px) rotateY(360deg);
		}
	}

	@keyframes mfm-tada {
		from {
			transform: scale3d(1, 1, 1);
		}
		10%,
		20% {
			transform: scale3d(0.9, 0.9, 0.9) rotate3d(0, 0, 1, -3deg);
		}
		30%,
		50%,
		70%,
		90% {
			transform: scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, 3deg);
		}
		40%,
		60%,
		80% {
			transform: scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, -3deg);
		}
		to {
			transform: scale3d(1, 1, 1);
		}
	}

	@keyframes mfm-jump {
		0% {
			transform: translateY(0);
		}
		25% {
			transform: translateY(-16px);
		}
		50% {
			transform: translateY(0);
		}
		75% {
			transform: translateY(-8px);
		}
		100% {
			transform: translateY(0);
		}
	}

	@keyframes mfm-bounce {
		0% {
			transform: translateY(0) scale(1, 1);
		}
		25% {
			transform: translateY(-16px) scale(1, 1);
		}
		50% {
			transform: translateY(0) scale(1, 1);
		}
		75% {
			transform: translateY(0) scale(1.5, 0.75);
		}
		100% {
			transform: translateY(0) scale(1, 1);
		}
	}

	@keyframes mfm-twitch {
		0% {
			transform: translate(7px, -2px);
		}
		5% {
			transform: translate(-3px, 1px);
		}
		10% {
			transform: translate(-7px, -1px);
		}
		15% {
			transform: translate(0px, -1px);
		}
		20% {
			transform: translate(-8px, 6px);
		}
		25% {
			transform: translate(-4px, -3px);
		}
		30% {
			transform: translate(-4px, -6px);
		}
		35% {
			transform: translate(-8px, -8px);
		}
		40% {
			transform: translate(4px, 6px);
		}
		45% {
			transform: translate(-3px, 1px);
		}
		50% {
			transform: translate(2px, -10px);
		}
		55% {
			transform: translate(-7px, 0px);
		}
		60% {
			transform: translate(-2px, 4px);
		}
		65% {
			transform: translate(3px, -8px);
		}
		70% {
			transform: translate(6px, 7px);
		}
		75% {
			transform: translate(-7px, -2px);
		}
		80% {
			transform: translate(-7px, -8px);
		}
		85% {
			transform: translate(9px, 3px);
		}
		90% {
			transform: translate(-3px, -2px);
		}
		95% {
			transform: translate(-10px, 2px);
		}
		100% {
			transform: translate(-2px, -6px);
		}
	}

	@keyframes mfm-shake {
		0% {
			transform: translate(-3px, -1px) rotate(-8deg);
		}
		5% {
			transform: translate(0px, -1px) rotate(-10deg);
		}
		10% {
			transform: translate(1px, -3px) rotate(0deg);
		}
		15% {
			transform: translate(1px, 1px) rotate(11deg);
		}
		20% {
			transform: translate(-2px, 1px) rotate(1deg);
		}
		25% {
			transform: translate(-1px, -2px) rotate(-2deg);
		}
		30% {
			transform: translate(-1px, 2px) rotate(-3deg);
		}
		35% {
			transform: translate(2px, 1px) rotate(6deg);
		}
		40% {
			transform: translate(-2px, -3px) rotate(-9deg);
		}
		45% {
			transform: translate(0px, -1px) rotate(-12deg);
		}
		50% {
			transform: translate(1px, 2px) rotate(10deg);
		}
		55% {
			transform: translate(0px, -3px) rotate(8deg);
		}
		60% {
			transform: translate(1px, -1px) rotate(8deg);
		}
		65% {
			transform: translate(0px, -1px) rotate(-7deg);
		}
		70% {
			transform: translate(-1px, -3px) rotate(6deg);
		}
		75% {
			transform: translate(0px, -2px) rotate(4deg);
		}
		80% {
			transform: translate(-2px, -1px) rotate(3deg);
		}
		85% {
			transform: translate(1px, -3px) rotate(-10deg);
		}
		90% {
			transform: translate(1px, 0px) rotate(3deg);
		}
		95% {
			transform: translate(-2px, 0px) rotate(-3deg);
		}
		100% {
			transform: translate(2px, 1px) rotate(2deg);
		}
	}

	@keyframes mfm-jelly {
		from {
			transform: scale3d(1, 1, 1);
		}
		30% {
			transform: scale3d(1.25, 0.75, 1);
		}
		40% {
			transform: scale3d(0.75, 1.25, 1);
		}
		50% {
			transform: scale3d(1.15, 0.85, 1);
		}
		65% {
			transform: scale3d(0.95, 1.05, 1);
		}
		75% {
			transform: scale3d(1.05, 0.95, 1);
		}
		to {
			transform: scale3d(1, 1, 1);
		}
	}

	@keyframes mfm-rainbow {
		0% {
			filter: hue-rotate(0deg) contrast(150%) saturate(150%);
		}
		100% {
			filter: hue-rotate(360deg) contrast(150%) saturate(150%);
		}
	}

	@keyframes mfm-fade {
		0% {
			opacity: 0;
		}
		50% {
			opacity: 1;
		}
		100% {
			opacity: 0;
		}
	}
</style>
