<script lang="ts">
	import Title from '$lib/component/basic/title.svelte';
	import Subtitle from '$lib/component/basic/subtitle.svelte';
	import { enhance } from '$app/forms';
	import { addressStore } from '$lib/stores/wallet';
	import Metadata from '$lib/component/posts/metadata.svelte';
	import type BigNumber from 'bignumber.js';
	import Icon from '../basic/icon.svelte';

	interface Data {
		id: string;
		title: string;
		description: string;
		imageUrl: string;
		videoUrl: string;
		upvote_count: number;
		downvote_count: number;
		userVote: boolean | null;
		stake: BigNumber;
		wallet_addr: string;
		created_at: string;
		validated: boolean;
		credibility: string;
		username: string;
	}

	export let data: Data;
	let timeLeft = { hours: 0, days: 0 };

	let validated: 'validated' | 'invalidated' | 'unverified' = calculateDaysPassed(data.created_at);

	function calculateDaysPassed(createdAt: string) {
		const createdDate = new Date(createdAt);
		const currentDate = new Date();

		const timeDifference = currentDate.getTime() - createdDate.getTime();

		const daysPassed = timeDifference / (1000 * 60 * 60 * 24);

		if (daysPassed >= 3) {
			const validated = data.upvote_count > data.downvote_count;
			if (validated) {
				return 'validated';
			} else {
				return 'invalidated';
			}
		} else {
			const remainingDays = 3 - daysPassed;

			if (remainingDays < 1) {
				timeLeft = { hours: Math.ceil(remainingDays * 24), days: 0 };
			} else {
				timeLeft = { hours: 0, days: Math.ceil(remainingDays) };
			}
			return 'unverified';
		}
	}

	const upvoteFunction = async ({ formData, cancel }) => {
		if (!$addressStore) {
			alert('Please connect your wallet');
			cancel();
			return;
		}
		const vote_type = data.userVote;

		formData.append('vote_type', vote_type);
		if (vote_type) {
			data = {
				...data,
				upvote_count: data.upvote_count - 1,
				userVote: null
			};
		} else if (vote_type === false) {
			data = {
				...data,
				upvote_count: data.upvote_count + 1,
				downvote_count: data.downvote_count - 1,
				userVote: true
			};
		} else {
			data = {
				...data,
				upvote_count: data.upvote_count + 1,
				userVote: true
			};
		}
	};

	const downvoteFunction = async ({ formData, cancel }) => {
		if (!$addressStore) {
			alert('Please connect your wallet');
			cancel();
			return;
		}
		const vote_type = data.userVote;

		formData.append('vote_type', vote_type);
		if (vote_type === false) {
			data = {
				...data,
				downvote_count: data.downvote_count - 1,
				userVote: null
			};
		} else if (vote_type === true) {
			data = {
				...data,
				upvote_count: data.upvote_count - 1,
				downvote_count: data.downvote_count + 1,
				userVote: false
			};
		} else {
			data = {
				...data,
				downvote_count: data.downvote_count + 1,
				userVote: false
			};
		}
	};
</script>

<article>
	<div class="top">
		<figure class="thumbnail-image">
			{#if data.imageUrl}
				<img src={data.imageUrl} alt="" />
			{/if}
			{#if data.videoUrl.length > 0}
				<video width="320" height="240" controls>
					<source src={data.videoUrl} type="video/mp4" />
					<track kind="captions" />
				</video>
			{/if}
		</figure>
		<header class="content-header padding">
			<Title title={data.title} />
			<Subtitle subtitle={data.description} />
		</header>
		<footer class="padding">
			<Metadata
				username={data.username}
				credibility={data.credibility}
				date={data.created_at}
				stake={data.stake}
			/>
		</footer>
	</div>

	<section class={`vote-bar padding ${validated}`}>
		<div class="vote-group">
			<form method="post" action="/?/upvote" use:enhance={upvoteFunction}>
				<input type="hidden" name="postId" value={data.id} />
				<input type="hidden" name="address" value={$addressStore} />
				<button class="vote-pair">
					<div class="hover-light upvote">
						<Icon name="upvote" width={'28px'} height={'28px'} />
					</div>
					<p>{data.upvote_count}</p>
				</button>
			</form>
			<form method="post" action="/?/downvote" use:enhance={downvoteFunction}>
				<input type="hidden" name="postId" value={data.id} />
				<input type="hidden" name="address" value={$addressStore} />
				<button class="vote-pair">
					<div class="hover-light downvote">
						<Icon name="downvote" width="28px" height="28px" />
					</div>
					<p>{data.downvote_count}</p>
				</button>
			</form>
		</div>
		<div class="countdown">
			{#if timeLeft.hours > 0}
				<Icon name="hourglass" viewBoxValues={[0, 0, 11, 16]} />
				{#if (timeLeft.hours = 1)}
					<p class="yellow highlight">{timeLeft.hours} hour</p>
				{:else}
					<p class="yellow highlight">{timeLeft.hours} hours</p>
				{/if}
			{:else if timeLeft.days > 0}
				<Icon name="hourglass" viewBoxValues={[0, 0, 11, 16]} />
				<p>{timeLeft.days} days</p>
			{/if}
		</div>
	</section>
</article>

<style lang="scss">
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

	footer {
		width: 100%;
	}

	.thumbnail-image {
		max-height: 20rem;
		overflow: hidden;
		width: 100%;
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
