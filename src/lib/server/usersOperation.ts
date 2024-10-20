import { client } from '$lib/server/heroku';

export const insertUser = async (wallet_addr: string) => {
	const res = await client.query(
		'INSERT INTO users (wallet_address, credibility) VALUES ($1, 50.0) RETURNING *',
		[wallet_addr]
	);
	return res;
};

export const insertContractAddr = async (wallet_addr: string, contract_addr: string) => {
	const res = await client.query(
		'UPDATE users SET contract_addr = $1 WHERE wallet_address = $2 RETURNING *',
		[contract_addr, wallet_addr]
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
 * and return their credibility if they exist
 * @param wallet_addr The wallet address to check
 * @returns {Promise<{ exists: boolean, credibility: number | null }>} An object with a boolean indicating if the user exists, and their credibility (or null if not found)
 */
export const checkUserEntry = async (
	wallet_addr: string
): Promise<{ exists: boolean; credibility: number | null; username: string | null }> => {
	try {
		const res = await client.query(
			'SELECT credibility, username FROM users WHERE wallet_address = $1 LIMIT 1',
			[wallet_addr]
		);

		// If a row is found, return the credibility and exists=true
		if (res.rows.length > 0) {
			return {
				exists: true,
				credibility: res.rows[0].credibility,
				username: res.rows[0].username
			};
		} else {
			// If no rows are found, return exists=false and credibility=null
			return {
				exists: false,
				credibility: null,
				username: null
			};
		}
	} catch (error) {
		console.error('Error checking user entry:', error);
		throw new Error('Database query failed');
	}
};
