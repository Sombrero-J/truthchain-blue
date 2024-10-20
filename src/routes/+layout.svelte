<script lang="ts">
	import '../styles/reset.css';
	import { onMount } from 'svelte';
	import Floatnav from '$lib/component/nav/floatnav.svelte';
	import Icon from '$lib/component/basic/icon.svelte';
	import { goto } from '$app/navigation';

	onMount(async () => {
		const { detectAccount } = await import('$lib/taquito/connectWallet');

		await detectAccount();
	});
</script>

<main>
	<button class="logo-container" on:click={() => goto('/')}>
		<Icon name="logo" width="118px" height="21px" viewBoxValues={[0, 0, 118, 21]} />
	</button>
	<div class="nav-full-container">
		<Floatnav />
	</div>

	<div class="children">
		<slot></slot>
	</div>
</main>

<style lang="scss">
	:global(body) {
		background-color: $background-dark;
	}

	.logo-container {
		position: absolute;
		top: 1rem;
		left: 1rem;
		cursor: pointer;
		border: none;
		background-color: transparent;
	}

	main {
		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.nav-full-container {
		width: 100%;
		position: fixed;
		bottom: 2rem;

		display: grid;
		justify-content: center; /* Centers horizontally */
		align-content: center;
	}

	.children {
		min-height: 100svh;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;

		width: 50%;

		border-left: 1px solid $color-border-gray;
		border-right: 1px solid $color-border-gray;

		margin-bottom: 6rem;
	}
</style>
