<script lang="ts">
	import ConnectWallet from '$lib/component/connectWallet.svelte';
	import { balanceStore, addressStore } from '$lib/stores/wallet';

	import { onMount } from 'svelte';
	let address: string;
	addressStore.subscribe((value) => {
		address = value;
	});

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
	<a href={`/profile?address=` + address}>Profile</a>
	<a href={'/create'}>Create Post</a>
{/if}
<slot></slot>
