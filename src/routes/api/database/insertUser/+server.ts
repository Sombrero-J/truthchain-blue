import { insertUser } from '$lib/server/usersOperation'; // Your Heroku database client
import { json, type RequestHandler } from '@sveltejs/kit';

// POST request handler to insert a new user
export const POST: RequestHandler = async ({ request, cookies }) => {
	try {
		const { wallet_addr } = await request.json();
		const res = await insertUser(wallet_addr);
		console.log('User successfully inserted:', wallet_addr);
		cookies.set('wallet_addr', wallet_addr, { path: '/' });
		return json({ success: true, user: res.rows[0] });
	} catch (error) {
		console.error('Error inserting user:', error);
		return json({ success: false, error: 'Failed to insert user' }, { status: 500 });
	}
};
