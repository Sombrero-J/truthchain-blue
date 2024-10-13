import { PinataSDK } from 'pinata-web3';
import { PINATA_JWT } from '$env/static/private';
import { PUBLIC_GATEWAY_URL } from '$env/static/public';

export const pinata = new PinataSDK({
	pinataJwt: `${PINATA_JWT}`,
	pinataGateway: `${PUBLIC_GATEWAY_URL}`
});

export async function uploadJson(jsonObj: object) {
	const upload = await pinata.upload.json(jsonObj);
  return upload.IpfsHash;
}

export async function uploadFile(file: File) {
	const upload = await pinata.upload.file(file);
	return upload.IpfsHash;
}