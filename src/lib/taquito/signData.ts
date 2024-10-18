import { stringToBytes } from '@taquito/utils';
import { walletStore, addressStore } from '$lib/stores/wallet';
import { type RequestSignPayloadInput, SigningType } from '@airgap/beacon-sdk';
// import('@airgap/beacon-sdk').then((module) => {
// 	const { SigningType } = module;
//     type RequestSignPayloadInput = typeof module.RequestSignPayloadInput;
//   }).catch((error) => {
// 	console.error('Failed to load module:', error);
//   });
import type { BeaconWallet as BWT } from '@taquito/beacon-wallet';
import { get } from 'svelte/store';

export const signData = async (input: string[]) => {
	const address: string = get(addressStore);
	const wallet: BWT | null = get(walletStore);

	console.log(address);

	if (!wallet || !address) {
		console.error('Wallet and address not connected, failed to sign');
		throw new Error('Wallet not connected');
	}

	const formattedInput: string = input.join(' ');

	const bytes = stringToBytes(formattedInput);
	const bytesLength = (bytes.length / 2).toString(16);
	const addPadding = `00000000${bytesLength}`;
	const paddedBytesLength = addPadding.slice(addPadding.length - 8);
	const payloadBytes = '05' + '01' + paddedBytesLength + bytes;

	const payload: RequestSignPayloadInput = {
		signingType: SigningType.MICHELINE,
		payload: payloadBytes,
		sourceAddress: address
	};

	const signedPayload = await wallet.client.requestSignPayload(payload);

	const { signature } = signedPayload;
	const pk = await wallet.getPK();

	return { signature, payloadBytes, pk };
};