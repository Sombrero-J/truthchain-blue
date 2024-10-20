<script lang="ts">
	export let text: number | string = 'Default Text';
	export let type: 'button' | 'submit' | 'reset' = 'submit';
	export let onClick: () => void = () => {};
	export let ariaLabel: string = '';

	export let selected = false;
</script>

<button class="btn" class:selected {type} on:click={onClick} aria-label={ariaLabel}>
	<p>{text}</p>
</button>

<style lang="scss">
	.btn {
		font-family: $primary-font;
		font-size: 0.875rem;
		font-style: normal;
		font-weight: 400;
		line-height: normal;

        border: none;

		background-color: transparent;

		text-wrap: nowrap;
		padding: 0.25rem 1.6875rem;

        cursor: pointer;
	}

    .btn.selected {
        border-bottom: 1px solid $color-text-white;
    }
</style>
