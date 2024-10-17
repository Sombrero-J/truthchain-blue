import type { PageServerLoad } from './$types';
import { getPostContent } from '$lib/server/pinata';
import { getAllPosts } from '$lib/server/postsOperation';


export const load: PageServerLoad = async () => {
	const {title, body, imageUrl, videoUrl} = await getPostContent('bafkreidhjw56xrfvfdmynurr3fg6zpjdoa6gsog5kuqekikdgcuf2hxatq');
	console.log(title, body, imageUrl, videoUrl);
	const rows = await getAllPosts();
	return { post: rows };
};