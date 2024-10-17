import { checkUserEntry } from '$lib/server/usersOperation';
import { json, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { wallet_addr } = await request.json();
		const res = await checkUserEntry(wallet_addr);
		console.log('User exists:', wallet_addr);
		return json({ success: true, exist: res });
	} catch (error) {
		console.error('Error checking user entry:', error);
		return json({ success: false, error: 'Failed to check user entry' });
	}
};