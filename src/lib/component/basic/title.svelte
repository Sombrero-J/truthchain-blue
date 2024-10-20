<script lang="ts">
	export let title: string | null;
	export let level: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' = 'h1';
</script>

{#if level === 'h1'}
	<h1>{title}</h1>
{:else if level === 'h2'}
	<h2>{title}</h2>
{:else if level === 'h3'}
	<h3>{title}</h3>
{:else if level === 'h4'}
	<h4>{title}</h4>
{:else if level === 'h5'}
	<h5>{title}</h5>
{:else if level === 'h6'}
	<h6>{title}</h6>
{/if}

<style lang="scss">
	h1,
	h2,
	h3,
	h4,
	h5,
	h6 {
		color: $color-text-white;
		font-family: $primary-font;
		font-size: $fs-title;
		font-weight: 600;
		line-height: normal;
	}
</style>
