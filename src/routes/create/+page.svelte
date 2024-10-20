<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';
	import { addressStore } from '$lib/stores/wallet';
	import ConnectWallet from '$lib/component/basic/connectWallet.svelte';
	import SectionHeading from '$lib/component/basic/sectionHeading.svelte';
	import Information from '$lib/component/form/information.svelte';
	import Textinput from '$lib/component/form/textinput.svelte';
	import Button from '$lib/component/basic/button.svelte';
	import DummyPost from '$lib/component/posts/dummyPost.svelte';
	import { onMount } from 'svelte'


	export let form: ActionData;

	let address: string | null;
	addressStore.subscribe((value) => {
		address = value;
	});

	interface Data {
		id: string;
		title: string;
		body: string;
		imageUrl: string;
		videoUrl: string;
		stake: string;
	}

	let title: string;
	let body: string;
	let imageUrl: string;
	let videoUrl: string;
	let stakeS: string;

	let data: Data;
	$: data = {
		id: '0',
		title: title,
		body: body,
		imageUrl: imageUrl,
		videoUrl: '',
		stake: stakeS
	};
</script>

{#if form?.error}
	<p>{form?.message}</p>
{:else if form?.success}
	<p>{form?.data}</p>
{/if}

{#if $addressStore}
	<main>
		<SectionHeading text="Create a post" />
		<Information />
		<form method="POST" action="?/create" enctype="multipart/form-data" use:enhance>
			<Textinput
				label="Title"
				name="title"
				bind:value={title}
				required={true}
				placeholder={'Enter your title here'}
			/>
			<Textinput
				label="Description"
				name="description"
				bind:value={body}
				support="This will be shown under the title in thumbnail view."
				required={true}
				placeholder={'Enter your description here'}
			/>
			<Textinput
				label="Body"
				name="body"
				support="Warning: contents violating the rules will result in loss of stakes. Please make sure to follow the regulations above. "
				required={true}
				placeholder={'Enter your body text here'}
				type={'textfield'}
			/>
			<Textinput
				label="Source"
				name="source"
				support="Upload at least one of the following:"
				required={true}
				type="multimedia"
				bind:firstUrl={imageUrl}
			/>
			<Textinput
				label="Stake"
				name="stake"
				bind:value={stakeS}
				support={`Specify the amount of stake for this post. It will be transferred from this (${address}) wallet`}
				required={true}
				placeholder={'Enter your stake here'}
			/>
			<p class="dummy">Preview</p>
			<DummyPost {data} />
			<div class="button">
				<Button type="submit" text="Publish" style="primary" />
			</div>
		</form>
	</main>
{:else}
	<p>Wallet not connected. You need to connect before posting</p>
	<ConnectWallet />
{/if}

<style lang="scss">
	.dummy {
		cursor: pointer;
		font-size: 1.2rem;
		font-weight: 500;
		line-height: normal;
	}

	form {
		font-family: $primary-font;
		color: $color-text-white;

		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: center;

		gap: 20px;

		width: 100%;
	}

	main {
		padding-top: 3rem;
		width: 80%;

		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: center;

		gap: 20px;
	}

	.button {
		align-self: flex-end;
	}
</style>
