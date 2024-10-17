<script lang="ts">
	import { balanceStore, addressStore } from '$lib/stores/wallet';
	import ConnectWallet from '$lib/component/connectWallet.svelte';
	import { userStore } from '$lib/stores/user';
	import type { ActionData } from '../$types';
    import { enhance } from '$app/forms';

    export let form: ActionData;
</script>

{#if $addressStore}
	My Truthchain Profile Your address is: {$addressStore}
	Your balance is: {$balanceStore}
	<form method="post" action="?/username" use:enhance>
		<label for="name-input">Your username: </label>
		<input type="text" id="name-input" name="username" autocomplete="off" />
        <input type="hidden" name="address" value={$addressStore}>
		<button type="submit"> Confirm </button>
	</form>
	{$userStore.walletAddress}
	{$userStore.username}

    {#if form?.success}
        <p>Success!</p>
    {/if}
{:else}
	<p>You're not connected to a wallet, click the button below to connect.</p>
	<ConnectWallet />
{/if}

<style>
</style>
