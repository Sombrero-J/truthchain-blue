<script lang="ts">
	export let subtitle: string = 'Default subtitle';
</script>

<p>{@html subtitle}</p>

<style lang="scss">
	p {
		font-family: $primary-font;

		color: $color-text-white;
		font-size: $fs-subtitle;
	}
</style>
