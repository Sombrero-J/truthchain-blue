<script lang="ts">
	import { addressStore } from '$lib/stores/wallet';
	import ConnectWallet from '$lib/component/basic/connectWallet.svelte';
	import { userStore } from '$lib/stores/user';
	import type {PageData } from '../$types';
	import Post from '$lib/component/posts/post.svelte';
	import Icon from '$lib/component/basic/icon.svelte';
	import Title from '$lib/component/basic/title.svelte';
	import TabButton from '$lib/component/basic/tabButton.svelte';

	export let data: PageData;

	let reveal = false;

	let username: string | null;
	userStore.subscribe((value) => {
		username = value.username;
	});
	let address: string | null;
	addressStore.subscribe((value) => {
		address = value;
	});
</script>

<main>
	{#if $addressStore}
		<article class="profile">
			<div class="info">
				<Icon name="validator" width="28px" height="28px" />
				<Title title={username || null} />
				<button
					class="reveal"
					on:mouseenter={() => (reveal = true)}
					on:mouseleave={() => (reveal = false)}>{reveal ? address : `Wallet Address`}</button
				>
			</div>

			<div class="bio">
				<h2>Bio</h2>
				<p>
					Ethical Journalist. I write about the environment, politics, and social issues. Passionate to unravel truth of the world.
				</p>
			</div>
			<div class="credibility">
				<Icon name="credibility" width="18px" height="18px" />
				<p>Credibility: 50</p>
			</div>
		</article>

		<section class="posts">
			<TabButton text="Posts" selected={true} />
			{#each data.post as post (post.id)}
				<Post data={post} />
			{/each}
		</section>
	{:else}
		<p>You're not connected to a wallet, click the button below to connect.</p>
		<ConnectWallet />
	{/if}
</main>

<style lang="scss">
	.posts {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 1rem;
	}
	main {
		font-family: $primary-font;
		color: $color-text-white;

		padding: 3rem 0;

		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;

		gap: 5rem;
	}

	.info {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 1rem;
	}

	.reveal {
		border: none;
		cursor: pointer;

		color: #85919c;

		padding: 0.0625rem 1.0625rem;

		border-radius: 0.9375rem;
		border: 1px solid #85919c;
		background-color: rgba(133, 145, 156, 0.3);
	}

	.bio {
		display: flex;
		justify-content: center;
		flex-direction: column;
		align-items: flex-start;
		h2 {
			font-size: 1rem;
			font-style: normal;
			font-weight: 500;
		}
		p {
			font-size: 1rem;
			font-style: normal;
			font-weight: 200;
		}
	}

	.credibility {
		display: flex;
		justify-content: center;
		align-items: center;

		font-size: 1rem;
		font-style: normal;
		font-weight: 500;

		gap: 0.3rem;
	}

	.profile {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: flex-start;
		gap: 1rem;
	}
</style>
