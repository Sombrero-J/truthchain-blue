import { client, query } from '$lib/server/heroku';
import BigNumber from 'bignumber.js';

export const insertPost = async (ipfs_hash: string, wallet_address: string, stake: string) => {
	try {
		const queryText = `
        INSERT INTO posts (ipfs_hash, wallet_addr, stake) 
        VALUES ($1, $2, $3)
        RETURNING id;
    `;

		const bigStake = new BigNumber(stake);
		const bigStakePrec = bigStake.toFixed(18);
		const values = [ipfs_hash, wallet_address, bigStakePrec];

		const insertToVoteCount = `
            INSERT INTO vote_count (post_id, upvote_count, downvote_count)
            VALUES ($1, 0, 0)
        `;

		await client.query('BEGIN');
		const res = await query(queryText, values);

		if (res.rows.length === 0 || !res.rows[0].id) {
			throw new Error('Failed to insert post and retrieve post id.');
		}
		console.log('id: ', res.rows[0].id);

		await query(insertToVoteCount, [res.rows[0].id]);
		await client.query('COMMIT');
		return res;
	} catch (error) {
		await client.query('ROLLBACK');
		console.error('Error inserting post:', error);
		throw new Error('Unable to insert post');
	}
};

export const insertContractAddr = async (post_id: string, contract_addr: string) => {
	const queryText = `
		UPDATE posts
		SET contract_addr = $2
		WHERE id = $1
		RETURNING *;
	`;

	try {
		const result = await query(queryText, [post_id, contract_addr]);
		return result.rows[0];
	} catch (error) {
		console.error('Error inserting contract address:', error);
		throw new Error('Unable to insert contract address');
	}
};

export const validate = async (postId: string) => {
	const queryText = `
        UPDATE posts
        SET validated = true 
        WHERE id = $1
        RETURNING *;
    `;

	try {
		const result = await query(queryText, [postId]);
		return result.rows[0];
	} catch (error) {
		console.error('Error validating post:', error);
		throw new Error('Unable to validate post');
	}
};

interface Post {
	id: number;
	ipfs_hash: string;
	created_at: Date;
	wallet_addr: string;
	stake: string;
	reward: string | null;
	validated: boolean;
}

export const getAllPosts = async (): Promise<Post[]> => {
	const queryText = `
		  SELECT * FROM posts
		ORDER BY created_at DESC
	  `;

	try {
		const result = await query(queryText, []);
		return result.rows as Post[]; // Explicitly cast result.rows to Post[]
	} catch (error) {
		console.error('Error getting posts:', error);
		throw new Error('Unable to get posts');
	}
};

export const getUserPosts = async (wallet_address: string) => {
	const queryText = `
        SELECT id, ipfs_hash, stake, created_at, validated FROM posts
		WHERE wallet_addr = $1
		ORDER BY created_at DESC
    `;

	try {
		const result = await query(queryText, [wallet_address]);
		return result.rows;
	} catch (error) {
		console.error('Error getting posts:', error);
		throw new Error('Unable to get posts');
	}
};
