<script lang="ts">
	import { onMount } from 'svelte';
	import { addressStore } from '$lib/stores/wallet';
	import { Buffer } from 'buffer';

	let connectWalletF: any;
	let disconnectWalletF: any;
	onMount(async () => {
		window.Buffer = Buffer;
		const { connectWallet, disconnectWallet } = await import(
			'$lib/taquito/connectWallet'
		);

		connectWalletF = connectWallet;

		disconnectWalletF = disconnectWallet;
	});
</script>

<div class="card">
	{#if $addressStore}
		<button on:click={disconnectWalletF}> Disconnect wallet </button>
	{:else}
		<button on:click={connectWalletF}> Connect wallet </button>
	{/if}
</div>
