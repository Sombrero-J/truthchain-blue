import { checkUserEntry } from '$lib/server/usersOperation';
import { json, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request, cookies }) => {
	try {
		const { wallet_addr } = await request.json();
		const exist = await checkUserEntry(wallet_addr);
		if (exist){
			cookies.set('wallet_addr', wallet_addr, {path: '/'});
		}
		return json({ success: true, exist: exist });
	} catch (error) {
		console.error('Error checking user entry:', error);
		return json({ success: false, error: 'Failed to check user entry' });
	}
};