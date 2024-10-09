import { fail, json, type Actions } from '@sveltejs/kit';
import { pinata } from '$lib/server/pinata';

export const actions: Actions = {
	default: async ({ request }) => {
		try {
			const formData = await request.formData();
			const uploadedFile = formData?.get('fileToUpload') as File;

			if (!uploadedFile.name || uploadedFile.size === 0) {
				return fail(400, {
					error: true,
					message: 'You must provide a file to upload'
				});
			}

			const upload = await pinata.upload.file(uploadedFile);
			const url = await pinata.gateways.convert(upload.IpfsHash);
			return { url, filename: uploadedFile.name, status: 200 };
		} catch (error) {
			console.log(error);
			return json({ error: 'Internal Server Error' }, { status: 500 });
		}
	}
};