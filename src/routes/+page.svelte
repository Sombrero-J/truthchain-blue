<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	export let form: ActionData;
	$: {
		title: form?.data?.title;
		body: form?.data?.body;
		video: form?.data?.video;
		image: form?.data?.image;
	}

	let uploading = false;

	function handleUpload() {
		uploading = true;
		return async ({ update }) => {
			await update();
			uploading = false;
		};
	}
</script>

<main>
	<form method="POST" enctype="multipart/form-data" use:enhance={handleUpload}>
		Title
		<input type="text" name="title">
		Description
		<textarea name="body"></textarea>
		Video
		<input type="file" name="video" accept="video/*">
		Image
		<input type="file" id="file" name="image" accept=".jpg, .jpeg, .png, .webp" />
		<button disabled={uploading} type="submit">
			{uploading ? 'Uploading...' : 'Upload'}
		</button>
	</form>
	{#if form && form.status === 200}
		<img src={image} alt={form.filename} />
	{/if}
</main>

<style>
	
</style>