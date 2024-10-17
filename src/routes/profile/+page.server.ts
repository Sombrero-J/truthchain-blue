import { fail, type Actions } from '@sveltejs/kit';
import { insertUsername } from '$lib/server/usersOperation';
import { verifySignature } from '@taquito/utils';
import { signData } from '$lib/taquito/signData';
import type { PageServerLoad } from './$types';
import { getUserPosts } from '$lib/server/postsOperation';

export const load: PageServerLoad = async () => {
	const rows = await getUserPosts();
	return { post: rows };
};

export const actions: Actions = {
	username: async ({ request }) => {
		const data = await request.formData();
		const username = data.get('username') as string;
		const address = data.get('address') as string;

		if (!username || !address) {
			return fail(400, {
				success: false,
				message: 'All form fields are required.'
			});
		}

        const { signature, payloadBytes, pk } = await signData([username]);

		const isVerified = verifySignature(
			payloadBytes,
			pk,
			signature
		);

        if (!isVerified) {
            return fail(400, {
                success: false,
                message: 'Signature verification failed.'
            });
        }
		console.log("verified")

		const res = await insertUsername(username, address);
		if (res.rows.length === 1) {
			return {
				success: true,
				message: 'Username inserted successfully.'
			};
		} else {
			return {
				success: false,
				message: 'Username insertion failed.'
			};
		}
	}
};