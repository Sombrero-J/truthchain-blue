import { insertUser, insertContractAddr } from '$lib/server/usersOperation'; // Your Heroku database client
import { json, type RequestHandler } from '@sveltejs/kit';
import { deployUser } from '$lib/taquito/deploy';

export const POST: RequestHandler = async ({ request, cookies }) => {
	try {
		const { wallet_addr } = await request.json();
		const res = await insertUser(wallet_addr);
		if (res.rows.length > 0) {
			const res = await deployUser(wallet_addr, 50, 0);
			if (res) {
				const { contract_address } = res;
				await insertContractAddr(wallet_addr, contract_address);
				console.log('User successfully inserted:', wallet_addr);
			}
		}
		cookies.set('wallet_addr', wallet_addr, { path: '/' });
		return json({ success: true, user: res.rows[0] });
	} catch (error) {
		console.error('Error inserting user:', error);
		return json({ success: false, error: 'Failed to insert user' }, { status: 500 });
	}
};
