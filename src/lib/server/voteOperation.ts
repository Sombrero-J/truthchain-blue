import { client, query } from './heroku';

export const insertVote = async (postId: string, wallet_address: string, vote: boolean) => {
	const queryText = `
        INSERT INTO vote (post_id, wallet_address, vote_type)
        VALUES ($1, $2, $3);
    `;

	const updateVoteCountQuery = `
        UPDATE vote_count
        SET 
            upvote_count = upvote_count + CASE WHEN $1 = true THEN 1 ELSE 0 END,
            downvote_count = downvote_count + CASE WHEN $1 = false THEN 1 ELSE 0 END
        WHERE post_id = $2;
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

export const getVotes = async () => {
	const queryText = `
        SELECT * FROM vote_count;
    `;
	try {
		const result = await query(queryText, []);
		return result;
	} catch (error) {
		console.error('Error getting upvotes:', error);
		throw new Error('Unable to get upvotes');
	}
};

export const getUserVotes = async (address: string) => {
	const queryText = `
		SELECT * FROM vote
		WHERE wallet_address = $1;
	`;
	try {
		const result = await query(queryText, [address]);
		return result;
	} catch (error) {
		console.error('Error getting user votes:', error);
		throw new Error('Unable to get user votes');
	}
};

export const removeUpvote = async (postId: string, wallet_address: string) => {
	const queryText = `
		DELETE FROM vote
		WHERE post_id = $1 AND wallet_address = $2;
	`;

	const updateVoteCountQuery = `
		UPDATE vote_count
		SET 
			upvote_count = upvote_count - 1
		WHERE post_id = $1;
	`;
	try {
		await client.query('BEGIN');
		await query(queryText, [postId, wallet_address]);
		await query(updateVoteCountQuery, [postId]);
		await client.query('COMMIT');
	} catch (error) {
		await client.query('ROLLBACK');
		console.error('Error removing vote:', error);
		throw new Error('Unable to remove vote');
	}
};

export const removeDownvote = async (postId: string, wallet_address: string) => {
	const queryText = `
		DELETE FROM vote
		WHERE post_id = $1 AND wallet_address = $2;
	`;

	const updateVoteCountQuery = `
		UPDATE vote_count
		SET 
			downvote_count = downvote_count - 1
		WHERE post_id = $1;
	`;
	try {
		await client.query('BEGIN');
		await query(queryText, [postId, wallet_address]);
		await query(updateVoteCountQuery, [postId]);
		await client.query('COMMIT');
	} catch (error) {
		await client.query('ROLLBACK');
		console.error('Error removing vote:', error);
		throw new Error('Unable to remove vote');
	}
};

export const removeUpvoteAndInsertDownvote = async (postId: string, wallet_address: string) => {
	try {
		await client.query('BEGIN');
		await removeUpvote(postId, wallet_address);
		await insertVote(postId, wallet_address, false);
		await client.query('COMMIT');
	} catch (error) {
		await client.query('ROLLBACK');
		console.error('Error removing vote:', error);
		throw new Error('Unable to remove vote');
	}
};

export const removeDownvoteAndInsertUpvote = async (postId: string, wallet_address: string) => {
	try {
		await client.query('BEGIN');
		await removeDownvote(postId, wallet_address);
		await insertVote(postId, wallet_address, true);
		await client.query('COMMIT');
	} catch (error) {
		await client.query('ROLLBACK');
		console.error('Error removing vote:', error);
		throw new Error('Unable to remove vote');
	}
};