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
	.highlight.yellow {
		color: $color-yellow-highlight;
	}

	.countdown {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 0;

		font-size: 0.75rem;
	}
	.validated {
		background-color: $color-validation-green;
	}

	.invalidated {
		background-color: $color-invalidation-red;
	}

	.unverified {
		background-color: $color-unverified-blue;
	}

	.thumbnail-image {
		max-height: 20rem; /* Set the maximum height */
		overflow: hidden; /* Hide anything that overflows the container */
		// display: block; /* Ensure it's treated as a block element */
	}

	.thumbnail-image img {
		width: 100%; /* Stretch the image to fill the width of the container */
		height: 100%; /* Let the image height fit the container's height */
		object-fit: cover; /* Crop the image to fit within the container */
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

	.vote-pair {
		display: flex;
		justify-content: center;
		align-items: center;

		gap: 0.3rem;

		border: none;
		background-color: transparent;
		padding: 0;

		cursor: pointer;
	}

	.vote-bar {
		display: flex;
		justify-content: space-between;
		align-items: center;

		width: 100%;
	}

	.vote-group {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 0.5rem;
	}

	.hover-light.upvote {
		background-color: transparent;
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 1px;
		border-radius: 50%;
	}

	.hover-light.downvote {
		background-color: transparent;
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 1px;
		border-radius: 50%;
	}

	.hover-light.upvote:hover {
		background-color: $color-upvote-highlight;
		display: flex;
		justify-content: center;
		align-items: center;
		// height: 28px;
		// width: 28px;
		padding: 1px;
		border-radius: 50%;
	}
	.hover-light.downvote:hover {
		background-color: $color-downvote-highlight;
		display: flex;
		justify-content: center;
		align-items: center;
		// height: 28px;
		// width: 28px;
		padding: 1px;

		border-radius: 50%;
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
