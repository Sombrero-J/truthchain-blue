import { fail, type Actions } from '@sveltejs/kit';
import { insertUsername } from '$lib/server/usersOperation';
import type { PageServerLoad } from './$types';
import { getUserPosts } from '$lib/server/postsOperation';
import { getUserVotes, getVotes } from '$lib/server/voteOperation';
import { getPostContent } from '$lib/server/pinata';
import { getUser } from '$lib/server/usersOperation';

export const load: PageServerLoad = async ({ cookies }) => {
	const address = cookies.get('wallet_addr');

	if (address) {
		const rows = await getUserPosts(address);
		if (rows.length > 0) {
			const allVotes = await getVotes();

			let userVotes = null;
			userVotes = await getUserVotes(address);

			const updatedRows = await Promise.all(
				rows.map(async (row) => {
					console.log('row:', row);
					const { title, description, imageUrl, videoUrl } = await getPostContent(row.ipfs_hash);
					const { username, credibility } = await getUser(address);

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

					if (!username) {
						return {
							...row,
							title,
							description,
							imageUrl,
							videoUrl,
							upvote_count: voteData.upvote_count,
							downvote_count: voteData.downvote_count,
							userVote: userVoteType,
							credibility,
							username
						};
					}

					return {
						...row,
						title,
						description,
						imageUrl,
						videoUrl,
						upvote_count: voteData.upvote_count,
						downvote_count: voteData.downvote_count,
						userVote: userVoteType,
						credibility,
						username
					};
				})
			);
			return { post: updatedRows };
		}
	}
	return { post: [] };
};

export const actions: Actions = {
	username: async ({ request }) => {
		const data = await request.formData();
		const username = data.get('username') as string;
		const address = data.get('address') as string;

		console.log('address:', address);

		if (!username || !address) {
			return fail(400, {
				success: false,
				message: 'All form fields are required.'
			});
		}

		const res = await insertUsername(username, address);
		if (res.rows.length === 1) {
			return {
				success: true,
				message: 'Username inserted successfully.'
			};
		} else {
			return {
				success: false,
				message: 'Username insertion failed.'
			};
		}
	}
};
