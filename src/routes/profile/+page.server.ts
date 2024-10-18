import { fail, type Actions } from '@sveltejs/kit';
import { insertUsername } from '$lib/server/usersOperation';
import type { PageServerLoad } from './$types';
import { getUserPosts } from '$lib/server/postsOperation';

export const load: PageServerLoad = async ({url}) => {
	const address = url.searchParams.get('address');
	if (!address) {
		return fail(400, {
			message: 'Something went wrong.'
		});
	}
	const rows = await getUserPosts(address);
	return { post: rows };
};

export const actions: Actions = {
	username: async ({ request }) => {
		const data = await request.formData();
		const username = data.get('username') as string;
		const address = data.get('address') as string;

		console.log('address:', address);

		if (!username || !address) {
			return fail(400, {
				success: false,
				message: 'All form fields are required.'
			});
		}

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