import { fail, type Actions } from '@sveltejs/kit';
import { uploadJson, uploadFile } from '$lib/server/pinata';
import { insertPost } from '$lib/server/postsOperation';
import { deployPost } from '$lib/taquito/deploy';
import { insertContractAddr } from '$lib/server/postsOperation';
import { redirect } from '@sveltejs/kit';

export const actions: Actions = {
	create: async ({ request, cookies }) => {
		try {
			const address = cookies.get('wallet_addr');
			const formData = await request.formData();
			const title = formData.get('title') as string;
			const description = formData.get('description') as string;
			const body = formData.get('body') as string;
			const videos = formData.getAll('video-source') as File[] | null;
			const images = formData.getAll('image-source') as File[] | null;
			const urls = formData.get('url-source') as string | null;
			const stake = formData.get('stake') as string;

			const urlHashes: string[] | null = [];

			if (title === '' || body === '' || description === '' || stake === '') {
				return fail(400, {
					error: true,
					message: 'You must provide a title, description, body and stake'
				});
			}

			const validImages = images?.filter((image) => image.size > 0);
			const validVideos = videos?.filter((video) => video.size > 0);

			if (validImages?.length === 0 && validVideos?.length === 0 && urls === '') {
				return fail(400, {
					error: true,
					message: 'You must upload at least one: an image, a video, or a URL'
				});
			}
			console.log('video: ', validVideos);
			console.log('image: ', validImages);
			console.log('url: ', urls);

			let videoHashes: (string | null)[] = [];
			let imageHashes: (string | null)[] = [];

			if (validVideos && validVideos.length > 0) {
				console.log('Uploading video');
				try {
					videoHashes = await Promise.all(validVideos.map((video) => uploadFile(video)));

					console.log('Uploaded videos successfully:', videoHashes);
				} catch (error) {
					console.error('Error uploading videos:', error);
				}
			}

			if (validImages && validImages.length > 0) {
				console.log('Uploading image');
				try {
					imageHashes = await Promise.all(validImages.map((image) => uploadFile(image)));

					console.log('Uploaded images successfully:', imageHashes);
				} catch (error) {
					console.error('Error uploading images:', error);
				}
			}

			if (urls && urls !== '') {
				const parsedUrls = parseUrls(urls);
				for (const url of parsedUrls) {
					if (url) {
						urlHashes.push(url);
					}
				}
				console.log('urlHashes: ', urlHashes);
			}

			function parseUrls(urlString: string): string[] {
				const urls = urlString.split(',').map((url) => url.trim());

				const validUrls = urls.filter((url) => url !== '');

				return validUrls;
			}

			const postIPFS = await uploadJson({
				title: title,
				description: description,
				body: body,
				image: imageHashes,
				video: videoHashes,
				url: urlHashes
			});

			const iRes = await insertPost(postIPFS, address!, stake);
			if (iRes.rows.length > 0) {
				const res = await deployPost(address!, postIPFS, false);
				if (res) {
					const { contract_address } = res;
					await insertContractAddr(iRes.rows[0].id, contract_address);
					console.log('Post successfully inserted:', iRes.rows[0].id);
					redirect(303, '/');
				}
			}
		} catch (error) {
			console.log(error);
			return fail(400, { error: true, message: 'Error creating post' });
		}
	}
};
