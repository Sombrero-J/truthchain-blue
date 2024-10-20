<script lang="ts">
	import type { PageData } from './$types';
	import Post from '$lib/component/posts/post.svelte';

	export let data: PageData;
</script>


	{#if data.post.length === 0}
		<p>Your homepage is empty, post something.</p>
	{:else}
		<section class="posts-section">
			{#each data.post as post (post.id)}
				<Post data={post} />
			{/each}
		</section>
	{/if}

<style lang="scss">
	/* main {
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	} */

	.posts-section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 1rem;

		width: 100%;
	}
</style>
