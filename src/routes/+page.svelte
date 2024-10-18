<script lang="ts">
	import type { PageData } from './$types';
	import { addressStore } from '$lib/stores/wallet';
	import { enhance } from '$app/forms';

	export let data: PageData;

	const upvoteFunction = async ({ formData, cancel }) => {
		if (!$addressStore) {
			alert('Please connect your wallet');
			cancel();
		}
		const postId = Number(formData.get('postId'));
		const targetPost = data.post.find((post) => post.id === postId);
		console.log(postId, targetPost);
		const vote_type = targetPost.userVote;

		formData.append('vote_type', vote_type);
		if (vote_type) {
			data = {
				...data,
				post: data.post.map((post) => {
					if (post.id === postId) {
						return {
							...post,
							upvote_count: post.upvote_count - 1,
							userVote: null
						};
					}
					return post;
				})
			};
		} else if (vote_type === false) {
			data = {
				...data,
				post: data.post.map((post) => {
					if (post.id === postId) {
						return {
							...post,
							upvote_count: post.upvote_count + 1,
							downvote_count: post.downvote_count - 1,
							userVote: true
						};
					}
					return post;
				})
			};
		} else {
			data = {
				...data,
				post: data.post.map((post) => {
					if (post.id === postId) {
						return {
							...post,
							upvote_count: post.upvote_count + 1,
							userVote: true
						};
					}
					return post;
				})
			};
		}
	};

	const downvoteFunction = async ({ formData, cancel }) => {
		if (!$addressStore) {
			alert('Please connect your wallet');
			cancel();
		}
		const postId = Number(formData.get('postId'));
		const targetPost = data.post.find((post) => post.id === postId);
		const vote_type = targetPost.userVote;

		formData.append('vote_type', vote_type);
		if (vote_type === false) {
			console.log('false');
			data = {
				...data,
				post: data.post.map((post) => {
					if (post.id === postId) {
						return {
							...post,
							upvote_count: post.downvote_count - 1,
							userVote: null
						};
					}
					return post;
				})
			};
		} else if (vote_type === true) {
			console.log('true');
			data = {
				...data,
				post: data.post.map((post) => {
					if (post.id === postId) {
						return {
							...post,
							upvote_count: post.upvote_count - 1,
							downvote_count: post.downvote_count + 1,
							userVote: false
						};
					}
					return post;
				})
			};
		} else {
			console.log('null');
			data = {
				...data,
				post: data.post.map((post) => {
					if (post.id === postId) {
						return {
							...post,
							downvote_count: post.downvote_count + 1,
							userVote: false
						};
					}
					return post;
				})
			};
		}
	};
</script>

{#if data.post.length === 0}
	<p>Your homepage is empty, post something.</p>
{:else}
	{#each data.post as post (post.id)}
		<article>
			<p>id: {post.id}</p>
			<p>Title: {post.title}</p>
			<p>Body: {post.body}</p>
			<p>Stake: {post.stake}</p>
			<p>Address: {post.wallet_addr}</p>
			{#if post.videoUrl}
				<video width="320" height="240" controls>
					<source src={post.videoUrl} type="video/mp4" />
					<track kind="captions" />
				</video>
			{/if}
			{#if post.imageUrl}
				<img src={post.imageUrl} alt="" />
			{/if}
			<p>{post.created_at}</p>
			<p>{post.validated}</p>
			{#if post.userVote !== null}
				<p>user {post.userVote ? 'upvoted' : 'downvote'}</p>
			{/if}
			<p>Upvote: {post.upvote_count}</p>
			<p>Downvote: {post.downvote_count}</p>
			<form method="post" action="?/upvote" use:enhance={upvoteFunction}>
				<input type="hidden" name="postId" value={post.id} />
				<input type="hidden" name="address" value={$addressStore} />
				<button>Upvote</button>
			</form>
			<form method="post" action="?/downvote" use:enhance={downvoteFunction}>
				<input type="hidden" name="postId" value={post.id} />
				<input type="hidden" name="address" value={$addressStore} />
				<button>Downvote</button>
			</form>
			<hr />
		</article>
	{/each}
{/if}

<style>
</style>
