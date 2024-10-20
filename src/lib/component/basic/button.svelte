<script lang="ts">
	export let text: number | string = 'Default Text';
	export let type: 'button' | 'submit' | 'reset' = 'submit';
	export let style: 'primary' | 'secondary' = 'primary';
	export let disabled: boolean = false;
	export let onClick: () => void = () => {};
	export let ariaLabel: string = '';

	let clicked = false;

	const changeState = () => (clicked = true);
</script>

<button
	class={`btn ${style}`}
	{type}
	on:click={onClick}
	aria-label={ariaLabel}
	{disabled}
	on:click={changeState}
>
	<slot name="left-icon"></slot>
	<p>{text}</p>
	<slot name="right-icon"></slot>
</button>

<style lang="scss">
	.btn {
		font-family: $primary-font;
		font-size: 1.125rem;
		font-style: normal;
		font-weight: 400;
		line-height: normal;

		border: 1px solid transparent;
		border-radius: $border-r;

		background-color: transparent;

		text-wrap: nowrap;

		display: flex;
		padding: 0.25rem 1.6875rem;
		justify-content: center;
		align-items: center;
	}

	.primary p {
		background: $gradient-brand;
		background-clip: text;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
	}

	.btn.primary:hover {
		cursor: pointer;
		background:
			linear-gradient($background-dark, $background-dark) padding-box,
			linear-gradient(to right, darkblue, darkorchid) border-box;

		// border-radius: $border-r;
		// border: 1px solid transparent;
	}

	.secondary p {
		color: $color-text-white;
		cursor: pointer;
	}

	.secondary:hover {
		border: 1px solid $color-text-white;
	}

	.secondary.clicked {
		border: 1px solid $color-text-white;
		background-color: hsla(0, 0%, 93%, 0.3);
	}

	.secondary:active{
		background-color: hsla(0, 0%, 93%, 0.5);
	}
</style>
