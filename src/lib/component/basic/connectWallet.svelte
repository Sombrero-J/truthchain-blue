<script lang="ts">
	import { onMount } from 'svelte';
	import { addressStore } from '$lib/stores/wallet';
	import { Buffer } from 'buffer';
	import Button from './button.svelte';

	let connectWalletF: any;
	let disconnectWalletF: any;
	onMount(async () => {
		window.Buffer = Buffer;
		const { connectWallet, disconnectWallet } = await import('$lib/taquito/connectWallet');

		connectWalletF = connectWallet;

		disconnectWalletF = disconnectWallet;
	});
</script>

<div class="card">
	{#if $addressStore}
		<Button text="Disconnect" style="secondary" onClick={disconnectWalletF} />
	{:else}
		<Button text="Connect" style="primary" onClick={connectWalletF} />
	{/if}
</div>
