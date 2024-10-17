import { client } from '$lib/server/heroku';

export const insertUser = async (wallet_addr: string) => {
	const res = await client.query(
		'INSERT INTO users (wallet_address, credibility) VALUES ($1, 5.0) RETURNING *',
		[wallet_addr]
	);
	return res;
};

export const insertUsername = async (username: string, wallet_addr: string) => {
    const res = await client.query(
        'UPDATE users SET username = $1 WHERE wallet_address = $2 RETURNING *',
        [username, wallet_addr]
    );
    return res;
};

export const insertStake = async (fixed_stake: string, wallet_addr: string) => {
	if (Number(fixed_stake) < 200) {
		throw new Error('Minimum fixed stake is 200, operation rejected.');
	} else {
		const res = await client.query(
			'UPDATE users SET fixed_stake = $1 WHERE wallet_address = $2 RETURNING *',
			[fixed_stake, wallet_addr]
		);
		return res;
	}
};

export const updateUsername = async (wallet_addr: string, username: string) => {
	const res = await client.query(
		'UPDATE users SET username = $1 WHERE wallet_address = $2 RETURNING *',
		[username, wallet_addr]
	);
	return res;
};

export const updateStake = async (fixed_stake: string, wallet_addr: string) => {
	const res = await client.query(
		'UPDATE users SET fixed_stake = $1 WHERE wallet_address = $2 RETURNING *',
		[fixed_stake, wallet_addr]
	);
	return res;
};

export const getUser = async (wallet_addr: string) => {
	try {
		const res = await client.query('SELECT * FROM users WHERE wallet_address = $1', [wallet_addr]);
		const rows = res.rows;
		if (rows.length === 0) {
			return null;
		} else if (rows.length > 1) {
			throw new Error('More than one user found');
		} else {
			return rows[0];
		}
	} catch (error) {
		console.error('Error getting user:', error);
		throw new Error('Database query failed');
	}
};

/**
 * Function to check if a user with the given wallet address exists in the users table
 * @param wallet_addr The wallet address to check
 * @returns {Promise<boolean>} true if the wallet address exists, false otherwise
 */
export const checkUserEntry = async (wallet_addr: string): Promise<boolean> => {
	try {
		// Query the users table to check if the wallet address exists
		const res = await client.query('SELECT 1 FROM users WHERE wallet_address = $1 LIMIT 1', [
			wallet_addr
		]);

		// If at least one row is found, the wallet address exists
		return res.rows.length > 0;
	} catch (error) {
		console.error('Error checking user entry:', error);
		throw new Error('Database query failed');
	}
};
