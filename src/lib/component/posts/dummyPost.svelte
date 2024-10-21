<script lang="ts">
	import Title from '$lib/component/basic/title.svelte';
	import Subtitle from '$lib/component/basic/subtitle.svelte';
	import Metadata from '$lib/component/posts/metadata.svelte';
	import type BigNumber from 'bignumber.js';
	import { userStore } from '$lib/stores/user';

	let username: string | null;
	let credibility: string | null;

	userStore.subscribe((value) => {
		username = value.username;
		credibility = value.credibility;
	});

	interface Data {
		id: string;
		title: string;
		body: string;
		imageUrl: string;
		videoUrl: string;
		stake: BigNumber | string;
	}

	export let data: Data;
</script>

<article>
	<div class="top">
		<figure class="thumbnail-image">
			{#if data.imageUrl}
				<img src={data.imageUrl} alt="" />
			{/if}
			{#if data.videoUrl}
				<video width="320" height="240" controls>
					<source src={data.videoUrl} type="video/mp4" />
					<track kind="captions" />
				</video>
			{/if}
		</figure>
		<header class="content-header padding">
			<Title title={data.title} />
			<Subtitle subtitle={data.body} />
		</header>
		<footer class="padding">
			<Metadata {username} {credibility} date={new Date()} stake={data.stake} />
		</footer>
	</div>
</article>

<style lang="scss">
	footer {
		width: 100%;
	}

	.thumbnail-image {
		max-height: 20rem; 
		overflow: hidden;
	}

	.thumbnail-image img {
		width: 100%; 
		height: 100%; 
		object-fit: cover; 
	}
	.padding {
		padding: 0 1rem;
	}
	article {
		color: $color-text-white;
		font-family: $primary-font;

		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: flex-start;
		gap: 0.8rem;
		width: 90%;

		padding-bottom: 1rem;
		border-bottom: 1px solid$color-border-gray;
	}

	.content-header {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: flex-start;
	}

	.top {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: flex-start;
		gap: 0.3125rem;

		width: 100%;
	}
</style>
