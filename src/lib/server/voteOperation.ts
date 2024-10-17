import { client, query } from './heroku';

export const insertVote = async (postId: string, wallet_address: string, vote: boolean) => {
	const queryText = `
        INSERT INTO vote (post_id, wallet_address, vote)
        VALUES ($1, $2, $3)
        RETURNING *;
    `;

	const updateVoteCountQuery = `
        UPDATE vote_count
        SET 
            upvote_count = upvote_count + CASE WHEN $1 = true THEN 1 ELSE 0 END,
            downvote_count = downvote_count + CASE WHEN $1 = false THEN 1 ELSE 0 END
        WHERE post_id = $2
        RETURNING *;
    `;
	try {
		await client.query('BEGIN');
		await query(queryText, [postId, wallet_address, vote]);
		await query(updateVoteCountQuery, [vote, postId]);
		await client.query('COMMIT');
	} catch (error) {
		await client.query('ROLLBACK');
		console.error('Error inserting vote:', error);
		throw new Error('Unable to insert vote');
	}
};

export const getVotes = async (postId: string) => {
	const queryText = `
        SELECT upvote_count AND downvote_count FROM vote_count
        WHERE post_id = $1;
    `;
	try {
		const result = await query(queryText, [postId]);
		return result;
	} catch (error) {
		console.error('Error getting upvotes:', error);
		throw new Error('Unable to get upvotes');
	}
};
