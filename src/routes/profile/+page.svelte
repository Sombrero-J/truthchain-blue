<script lang="ts">
	import { balanceStore, addressStore } from '$lib/stores/wallet';
	import ConnectWallet from '$lib/component/connectWallet.svelte';
	import { userStore } from '$lib/stores/user';
	import type { ActionData, PageData } from '../$types';
	import { enhance } from '$app/forms';
	import { signData } from '$lib/taquito/signData'; 
	import { verifySignature } from '@taquito/utils';

	export let form: ActionData;
	export let data: PageData;

	async function handleEnhance({ formData, cancel }) {
        const username = formData.get('username') as string;

        const { signature, payloadBytes, pk } = await signData([username]);

        const isVerified = verifySignature(payloadBytes, pk, signature);

        if (!isVerified) {
            cancel();
        }
    }
</script>

{#if $addressStore}
	My Truthchain Profile Your address is: {$addressStore}
	Your balance is: {$balanceStore}
	<form
		method="post"
		action="?/username"
		use:enhance={handleEnhance}
	>
		<label for="name-input">Your username: </label>
		<input type="text" id="name-input" name="username" autocomplete="off" />
		<input type="hidden" name="address" value={$addressStore} />
		<button type="submit"> Confirm </button>
	</form>
	{$userStore.walletAddress}
	{$userStore.username}

	{#if form?.success}
		<p>Success!</p>
	{/if}

	{#each data.post as post (post.id)}
		<div>
			<h2>{post.ipfs_hash}</h2>
			<p>{post.created_at}</p>
		</div>
	{/each}
{:else}
	<p>You're not connected to a wallet, click the button below to connect.</p>
	<ConnectWallet />
{/if}

<style>
</style>
