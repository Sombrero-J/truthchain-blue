<script lang="ts">
	import Button from '../basic/button.svelte';
	import { userStore } from '$lib/stores/user';
	import ConnectWallet from '$lib/component/basic/connectWallet.svelte';
	import { goto } from '$app/navigation';

	const goToCreate = () => goto('/create');
	const goToHome = () => goto('/');
	const goToProfile = () => goto('/profile');
</script>

<nav>
	<Button text="Home" style="secondary" onClick={goToHome} />
	<Button text="Create" style="primary" onClick={goToCreate} />
	{#if !$userStore.walletAddress}
		<ConnectWallet />
	{:else if $userStore.username}
		<Button text={$userStore.username} style="secondary" onClick={goToProfile} />
	{:else if $userStore.walletAddress}
		<Button text={$userStore.walletAddress} style="secondary" onClick={goToProfile} />
	{/if}
</nav>

<style lang="scss">
	nav {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 8px;

		border-radius: $border-r;
		border: 1px solid $color-nav-gray;

		width: min-content;

		background-color: hsla(234, 100%, 4%, 1);
		box-shadow: 0px 0px 5px 0px $color-nav-gray;

		z-index: 1000;
	}
</style>
