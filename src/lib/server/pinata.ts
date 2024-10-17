import { PinataSDK } from 'pinata-web3';
import { PINATA_JWT } from '$env/static/private';
import { PUBLIC_GATEWAY_URL } from '$env/static/public';

export const pinata = new PinataSDK({
	pinataJwt: `${PINATA_JWT}`,
	pinataGateway: `${PUBLIC_GATEWAY_URL}`
});

export async function uploadJson(jsonObj: object): Promise<string> {
	try {
		const upload = await pinata.upload.json(jsonObj);
		return upload.IpfsHash;
	} catch (error) {
		console.error('Error uploading json:', error);
		throw new Error('Error uploading json');
	}
}

export async function uploadFile(file: File): Promise<string | null> {
	try {
		if (file) {
			const upload = await pinata.upload.file(file);
			return upload.IpfsHash;
		}
		return null;
	} catch (error) {
		console.error('Error uploading file:', error);
		throw new Error('Error uploading file');
	}
}

export async function uploadUrl(url: string): Promise<string | null> {
	try {
		if (url) {
			const upload = await pinata.upload.url(url);
			return upload.IpfsHash;
		}
		return null;
	} catch (error) {
		console.error('Error uploading url:', error);
		throw new Error('Error uploading url');
	}
}

const getFromHash = async (hash: string) => {
	try {
		const content = await pinata.gateways.get(hash);
		return content;
	} catch (error) {
		console.error('Error getting content:', error);
		throw new Error('Error getting content');
	}
};

export const getPostContent = async (hash: string) => {
	try {
		const content = await getFromHash(hash);
		const { title, body, image, video } = content.data;
		const imageUrl = image ? await getFromHash(image) : null;

		const vid = video ? await convertIpfs(video) : null;
		console.log('vid:', vid);
		
		const videoUrl = video ? await getFromHash(video) : null;
		return { title, body, imageUrl, videoUrl };
	} catch (error) {
		console.error('Error getting post content:', error);
		throw new Error('Error getting post content');
	}
};

const convertIpfs = async (hash: string) => {
	try {
		const url = await pinata.gateways.convert(hash);
		return url;
	} catch (error) {
		console.error('Error getting content:', error);
		throw new Error('Error getting content');
	}
};
