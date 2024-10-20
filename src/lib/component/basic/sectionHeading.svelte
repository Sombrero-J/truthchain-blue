<script lang="ts">
	export let text: string = 'Default Section Heading';
</script>

<h1>{text}</h1>

<style lang="scss">
	h1 {
		color: $color-text-white;
		font-family: $primary-font;
		font-size: 1.625rem;
		font-weight: 600;
		line-height: normal;
	}
</style>
