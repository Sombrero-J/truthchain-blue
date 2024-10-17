<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';
	import { addressStore } from '$lib/stores/wallet';
	import ConnectWallet from '$lib/component/connectWallet.svelte';
	import type { PageData } from '../$types';

	export let data: PageData;
	export let form: ActionData;

	let uploading = false;

	function handleUpload() {
		uploading = true;
		return async ({ update }) => {
			await update();
			uploading = false;
		};
	}
</script>

{#if form?.error}
	<p>{form?.message}</p>
{:else if form?.success}
	<p>{form?.data}</p>
{/if}

{#if $addressStore}
	<main>
		<form method="POST" enctype="multipart/form-data" use:enhance={handleUpload}>
			Title
			<input type="text" name="title" required />
			Description
			<textarea name="body" required></textarea>
			Video
			<input type="file" name="video" accept="video/*" />
			Image
			<input type="file" id="file" name="image" accept=".jpg, .jpeg, .png, .webp" />
			<input type="hidden" name="address" value={$addressStore} />
			Stake
			<input type="number" name="stake" required />
			Url
			<input type="text" name="url" />
			<button disabled={uploading} type="submit">
				{uploading ? 'Uploading...' : 'Upload'}
			</button>
		</form>
	</main>

	{#if data.post.length === 0}
		<p>Your homepage is empty, post something.</p>
	{:else}
		{#each data.post as post (post.id)}
			<article>
				<p>Stake: {post.stake}</p>
				<p>Address: {post.wallet_addr}</p>
			</article>
		{/each}
	{/if}
{:else}
	<p>Wallet not connected. You need to connect before posting</p>
	<ConnectWallet />
{/if}
