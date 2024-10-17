import { fail, type Actions } from '@sveltejs/kit';
import { uploadFile, uploadJson, uploadUrl } from '$lib/server/pinata';

export const actions: Actions = {
	default: async ({ request }) => {
		try {
			const formData = await request.formData();
			const title = formData.get('title') as string;
			const body = formData.get('body') as string;
			const address = formData.get('address') as string;
			const video = formData.get('video') as File | null;
			const image = formData.get('image') as File | null;
			const stake = formData.get('stake') as string;
			const url = formData.get('url') as string | null;

			let videoHash: string | null = '';
			let imageHash: string | null = '';
			let urlHash: string | null = '';

			if (title === '' || body === '') {
				return fail(400, {
					error: true,
					message: 'You must provide a title and description'
				});
			}

			if (video && video.size > 0) {
				console.log('Uploading video');
				videoHash = await uploadFile(video);
			}

			if (image && image.size > 0) {
				console.log('Uploading image');
				imageHash = await uploadFile(image);
			}

			if (url && url !== '') {
				console.log('Uploading url');
				urlHash = await uploadUrl(url);
			}

			const postIPFS = await uploadJson({
				title: title,
				body: body,
				image: imageHash,
				video: videoHash,
				url: urlHash
			});

			const res = await insertPost(postIPFS, address, stake);
			return { success: true, data: res.rows[0] };
		} catch (error) {
			console.log(error);
			return fail(400, { error: true, message: 'Error creating post' });
		}
	}
};
