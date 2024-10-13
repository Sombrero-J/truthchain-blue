import { fail, json, type Actions } from '@sveltejs/kit';
import { pinata } from '$lib/server/pinata';
import type { GetCIDResponse } from 'pinata-web3';
import { uploadFile, uploadJson } from '$lib/server/pinata';
import type { PageServerLoad } from './$types';
import {query} from '$lib/server/heroku';

export const load: PageServerLoad = async () => {
	const res = query('SELECT * FROM user', [])
	console.log(res);
	return {
		props: {}
	};
}


export const actions: Actions = {
	default: async ({ request }) => {
		try {
			const formData = await request.formData();
			const title = formData.get('title') as string;
			const body = formData.get('body') as string;
			const video = formData.get('video') as File;
			const image = formData.get('image') as File;

			let videoHash = '';
			let imageHash = '';

			if (title === '' || body === '') {
				return fail(400, {
					error: true,
					message: 'You must provide a title and description'
				});
			}

			if (video) {
				videoHash = await uploadFile(video);
			}

			if (image) {
				imageHash = await uploadFile(image);
			}

			const postIPFS = await uploadJson({
				title: title,
				body: body,
				image: imageHash,
				video: videoHash
			});

			const res: GetCIDResponse = await pinata.gateways.get(postIPFS);
			const data = res.data;
			console.log(data);
			return { data: {title, body, video, image}, status: 200 };
		} catch (error) {
			console.log(error);												
			return json({ error: 'Internal Server Error' }, { status: 500 });
		}
	}
};
