<script lang="ts">
	import ConnectWallet from '$lib/component/connectWallet.svelte';
	import { balanceStore, addressStore } from '$lib/stores/wallet';

	import { onMount } from 'svelte';
	onMount(async () => {

		const { detectAccount } = await import('$lib/taquito/connectWallet');

		detectAccount();
	});
</script>

{#if !$addressStore}
	<ConnectWallet />
{:else}
	{$addressStore}
	{$balanceStore}
    <a href="/profile">Profile</a>
{/if}
<slot></slot>
