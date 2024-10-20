<script lang="ts">
	export let label: string;
	export let value: string = '';
	export let name: string;
	export let support: string = '';
	export let placeholder: string = 'Default placeholder';
	export let required = false;
	export let type: 'text' | 'textfield' | 'multimedia' = 'text';
	export let firstUrl: string = '';

	import Icon from '$lib/component/basic/icon.svelte';

	let insertUrl = false;
	let urlInput: string[] = [''];

	let imageUrl: ImageUrl[] = [];
	type ImageUrl = { url: string; name: string };

	function handleFileChange(event: any) {
		const files = event.target.files;
		firstUrl = URL.createObjectURL(files[0]);
		if (files) {
			Array.from(files).forEach((file) => {
				imageUrl = [
					...imageUrl,
					{
						url: URL.createObjectURL(file),
						name: file.name
					}
				];
			});
		}
	}

	const addInput = () => {
		urlInput = [...urlInput, ''];
	};

	const updateUrl = (index, event) => {
		urlInput[index] = event.target.value; // Update the specific URL in the array
		concatUrl = urlInput.filter(Boolean).join(', '); // Concatenate all non-empty URLs
	};

	let concatUrl: string | null = null;
</script>

<div class="container">
	<div class="caption">
		<label for="ref">{label}<span class="blue">{required ? '*' : ''}</span></label>
		{#if support}
			<p class="support">{support}</p>
		{/if}
	</div>
	{#if type === 'textfield'}
		<textarea {name} id="ref" bind:value {placeholder} {required}></textarea>
	{:else if type === 'text'}
		<input type="text" {name} id="ref" bind:value {placeholder} {required} />
	{:else if type === 'multimedia'}
	{imageUrl}
		<div class="multimedia-container">
			<div class="mm-item">
				<div class="mm-caption">
					<Icon name="image" width="48px" height="46px" viewBoxValues={[0, 0, 48, 46]} />
					<p class="gradient">Image</p>
				</div>
				<input
					class="mm-upload"
					type="file"
					id="file"
					name="image-source"
					accept=".jpg, .jpeg, .png, .webp"
					on:change={handleFileChange}
					multiple
				/>
			</div>
			<div class="mm-item">
				<div class="mm-caption">
					<Icon name="video" width="58px" height="42px" viewBoxValues={[0, 0, 58, 42]} />
					<p class="gradient">Video</p>
				</div>
				<input class="mm-upload" type="file" name="video-source" accept="video/*" multiple/>
			</div>

			<button type="button" class="mm-item" on:click={() => (insertUrl = !insertUrl)}>
				<div class="mm-caption">
					<Icon name="url" width="47px" height="46px" viewBoxValues={[0, 0, 47, 46]} />
					<p class="gradient">URL</p>
				</div>
				<input class="mm-upload" type="hidden" name="url-source" id="urlinput" value={concatUrl} />
			</button>
		</div>

		{#if imageUrl.length > 0}
			<div class="uploaded-container">
				<p class="support">Uploaded:</p>
				<div class="item-container">
					{#each imageUrl as image}
						<img src={image.url} alt={image.name} />
					{/each}
				</div>
			</div>
		{/if}

		{#if insertUrl}
			<div class="url-input-container">
				<label for="urlsource">Insert your source URLs below:</label>
				{#each urlInput as url, index}
					<input
						type="text"
						id={url + index}
						placeholder="https://example.com"
						on:click={addInput}
						on:input={(event) => updateUrl(index, event)}
						bind:value={urlInput[index]}
					/>
				{/each}
			</div>
		{/if}
	{/if}
</div>

<style lang="scss">
	.url-input-container {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: flex-start;
		gap: 4px;

		margin-top: 0.3125rem;
	}

	.uploaded-container {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: flex-start;
		gap: 8px;
	}

	img {
		max-height: 10rem;
		width: auto;
		object-fit: contain;
	}

	.item-container {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 15px;
	}
	.mm-caption {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 8px;
	}

	.gradient {
		background: $gradient-brand;
		background-clip: text;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
	}

	button.mm-item {
		cursor: pointer;
		background-color: transparent;
	}

	.mm-item {
		position: relative;
		text-align: center;

		display: flex;
		flex-direction: column;

		justify-content: center;
		align-items: center;
		height: 12rem;
		width: 12rem;

		border-radius: $border-r-sm;
		border: 1px solid $color-border-gray;
	}

	.mm-upload {
		height: 100%;
		width: 100%;
		opacity: 0;
		cursor: pointer;
		position: absolute;
	}

	.container {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: flex-start;
		gap: $gap-sm;

		font-family: $primary-font;
		color: $color-text-white;

		width: 100%;
	}

	.multimedia-container {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: $gap-lg;

		// width: 100%;
	}

	.blue {
		color: $color-text-brand;
	}

	.caption {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: flex-start;
		gap: 0;
	}

	label {
		cursor: pointer;
		font-size: 1.2rem;
		font-weight: 500;
		line-height: normal;
	}

	.support {
		font-size: 1rem;
		font-weight: 300;
		line-height: normal;
	}

	input {
		background-color: transparent;
		padding: 0.5rem;

		border-radius: var(--border-radius, 0.625rem);
		border: 1px solid var(--colour-gray, #494949);

		width: 100%;
	}

	input:focus {
		outline: none;
		border: 1px solid white;
	}

	textarea {
		background-color: transparent;
		padding: 0.5rem;

		width: 100%;

		border-radius: var(--border-radius, 0.625rem);
		border: 1px solid var(--colour-gray, #494949);
		resize: none;
	}

	textarea:focus {
		outline: none;
		border: 1px solid white;
	}
</style>
