<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

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

<main>
	<form method="POST" enctype="multipart/form-data" use:enhance={handleUpload}>
		<input type="file" id="file" name="fileToUpload" accept=".jpg, .jpeg, .png, .webp" />
		<button disabled={uploading} type="submit">
			{uploading ? 'Uploading...' : 'Upload'}
		</button>
	</form>
	{#if form && form.status === 200}
		<img src={form.url} alt={form.filename} />
	{/if}
</main>