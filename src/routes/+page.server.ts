import type { PageServerLoad } from './$types';
import { getPostContent } from '$lib/server/pinata';
import { getAllPosts } from '$lib/server/postsOperation';
import {
	insertVote,
	getVotes,
	getUserVotes,
	removeDownvote,
	removeUpvoteAndInsertDownvote
} from '$lib/server/voteOperation';
import { type Actions } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ url, cookies }) => {
	const rows = await getAllPosts();
	const address = cookies.get('wallet_addr');

	if (rows.length > 0) {
		const allVotes = await getVotes();
		let userVotes = null;
		if (address) {
			userVotes = await getUserVotes(address);
		}

		const updatedRows = await Promise.all(
			rows.map(async (row) => {
				const { title, body, imageUrl, videoUrl } = await getPostContent(row.ipfs_hash);

				const voteData = allVotes.rows.find((vote) => vote.post_id === row.id) || {
					upvote_count: 0,
					downvote_count: 0
				};

				let userVoteType = null;

				if (userVotes) {
					const userVote = userVotes.rows.find((vote) => vote.post_id === row.id);
					if (userVote) {
						userVoteType = userVote.vote_type;
					}
				}

				return {
					...row,
					title,
					body,
					imageUrl,
					videoUrl,
					upvote_count: voteData.upvote_count,
					downvote_count: voteData.downvote_count,
					userVote: userVoteType
				};
			})
		);

		return { post: updatedRows };
	}

	return { post: rows };
};

export const actions: Actions = {
	upvote: async ({ request }) => {
		const data = await request.formData();
		const postId = data.get('postId') as string;
		const address = data.get('address') as string;
		const vote_type = data.get('vote_type') as string;
		console.log('vote_type: ', vote_type);
		if (vote_type === 'true') {
			await removeUpvoteAndInsertDownvote(postId, address);
		} else if (vote_type === 'false') {
			await removeDownvote(postId, address);
			await insertVote(postId, address, true);
		} else {
			await insertVote(postId, address, true);
		}
	},
	downvote: async ({ request }) => {
		const data = await request.formData();
		const postId = data.get('postId');
		const address = data.get('address');
		const vote_type = data.get('vote_type') as string;
		console.log('vote_type: ', vote_type);
		if (vote_type === 'true') {
			await removeUpvoteAndInsertDownvote(postId, address);
		} else if (vote_type === 'false') {
			await removeDownvote(postId, address);
		} else {
			await insertVote(postId, address, false);
		}
	}
};
