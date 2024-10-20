// main.ts
import { TezosToolkit } from '@taquito/taquito';
import { InMemorySigner } from '@taquito/signer';
import post from '$lib/contracts/post.json';
import user from '$lib/contracts/user.json';

const RPC_URL = 'https://rpc.ghostnet.teztnets.com/';

export const deployPost = async (
	user_addr: string,
	postIpfs: string,
	validated: boolean
): Promise<
	| {
			operation_hash: string;
			contract_address: string;
	  }
	| undefined
> => {
	try {
		const tezos = new TezosToolkit(RPC_URL);
		tezos.setSignerProvider(
			new InMemorySigner(
				'edskRo417bodJqeDwghUHZiAtPNS7WuH5xxRBqD85CN9xChjz964V8jSTyXihq2fdxkrd2qLd9HnAiKHoFV1E8Et1NvrhMHXCx'
			)
		);

		const initialStorage = {
			user_addr: user_addr,
			cid: postIpfs,
			label: validated
		};

		const origination = await tezos.contract.originate({
			code: post,
			storage: initialStorage
		});

		await origination.confirmation();
		const contract = await origination.contract();

		console.log('Post contract deployed at: ', contract.address);

		return { operation_hash: origination.hash, contract_address: contract.address };
	} catch (err) {
		console.log(err);
		return { operation_hash: '', contract_address: '' };
	}
};

export const deployUser = async (user_addr: string, credibility: number, truth_stake: number) => {
	try {
		const tezos = new TezosToolkit(RPC_URL);
		tezos.setSignerProvider(
			new InMemorySigner(
				'edskRo417bodJqeDwghUHZiAtPNS7WuH5xxRBqD85CN9xChjz964V8jSTyXihq2fdxkrd2qLd9HnAiKHoFV1E8Et1NvrhMHXCx'
			)
		);

		const initialStorage = {
			user_addr: user_addr,
			credibility: credibility,
			votingweightage: 1,
			truth_stake: truth_stake
		};

		const origination = await tezos.contract.originate({
			code: user,
			storage: initialStorage
		});

		await origination.confirmation();
		const contract = await origination.contract();

		console.log('User contract deployed at: ', contract.address);

		return { operation_hash: origination.hash, contract_address: contract.address };
	} catch (err) {
		console.log(err);
	}
};
