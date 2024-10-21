import BigNumber from 'bignumber.js';
import { TezosToolkit } from '@taquito/taquito';
import { BeaconWallet } from '@taquito/beacon-wallet';
import { NetworkType, type AccountInfo, type DAppClientOptions } from '@airgap/beacon-sdk';
import { walletStore, balanceStore, addressStore } from '$lib/stores/wallet';
import { userStore } from '$lib/stores/user';

const rpcUrl = 'https://ghostnet.ecadinfra.com';

let tezosInstance: TezosToolkit | null = null;
let walletInstance: BeaconWallet | null = null;

const initializeTezosToolkit = (): TezosToolkit => {
	if (!tezosInstance) {
		console.log('Initializing TezosToolkit...');
		tezosInstance = new TezosToolkit(rpcUrl);
	}
	return tezosInstance;
};

const initializeWallet = (): BeaconWallet => {
	if (!walletInstance) {
		console.log('Initializing BeaconWallet...');
		const options: DAppClientOptions = {
			name: 'Truthchain App',
			network: { type: NetworkType.GHOSTNET },
			enableMetrics: true
		};
		walletInstance = new BeaconWallet(options);
		walletStore.set(walletInstance);
		const Tezos = initializeTezosToolkit();
		Tezos.setWalletProvider(walletInstance);
	}
	return walletInstance;
};

export const connectWallet = async () => {
	const wallet = initializeWallet();
	try {
		await wallet.requestPermissions();
		const address = await wallet.getPKH();
		addressStore.set(address);

		const { exists, credibility, username } = await checkUserEntry(address);
		if (!exists) {
			await insertUser(address);
			userStore.update((currentUser) => ({
				...currentUser,
				credibility: 50.0,
				username: address
				// USERNAME SET TO ADDRESS IF USER IS NEWLY CREATED
			}));
			await getWalletBalance(address);
		} else {
			userStore.update((currentUser) => ({
				...currentUser,
				credibility: credibility,
				username: username
			}));
			await getWalletBalance(address);
		}
	} catch (error) {
		console.error('Failed to connect wallet', error);
	}
};

export const disconnectWallet = () => {
	const wallet = initializeWallet();
	wallet.client.clearActiveAccount();
	walletStore.set(null);
	addressStore.set('');
	userStore.set({ walletAddress: null, username: null, fixedStake: null, credibility: null });
	console.log('Wallet disconnected');
};

const getWalletBalance = async (walletAddress: string) => {
	try {
		const tezos = initializeTezosToolkit();
		const balanceMutez = await tezos.tz.getBalance(walletAddress);
		const balanceTez = new BigNumber(balanceMutez).div(1000000).toFormat(2);
		balanceStore.set(balanceTez);
	} catch (error) {
		console.error('Failed to fetch balance', error);
		balanceStore.set('0.00');
	}
};

export const detectAccount = async (): Promise<AccountInfo | null> => {
	const wallet = initializeWallet();
	const activeAccount = await wallet.client.getActiveAccount();
	console.log('account found: ', activeAccount);
	if (activeAccount) {
		addressStore.set(activeAccount.address);
		await getWalletBalance(activeAccount.address);
		const { exists, credibility, username } = await checkUserEntry(activeAccount.address);
		if (!exists) {
			await insertUser(activeAccount.address);
			userStore.update((currentUser) => ({
				...currentUser,
				credibility: 5.0,
				username: activeAccount.address
				// USERNAME SET TO ADDRESS IF USER IS NEWLY CREATED
			}));
			return activeAccount;
		} else {
			userStore.update((currentUser) => ({
				...currentUser,
				credibility: credibility,
				username: username
			}));
			return activeAccount;
		}
	} else {
		console.error('User wallet not connected!');
		return null;
	}
};

const checkUserEntry = async (walletAddress: string) => {
	const response = await fetch('/api/database/checkUserEntry', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			wallet_addr: walletAddress
		})
	});

	const result = await response.json();
	if (result.success) {
		return result.exist;
	} else {
		console.error(result.error);
	}
};

const insertUser = async (walletAddress: string) => {
	const response = await fetch('/api/database/insertUser', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			wallet_addr: walletAddress
		})
	});

	const result = await response.json();
	if (result.success) {
		console.log('User successfully inserted:', result.user);
	} else {
		console.error('Failed to insert user:', result.error);
	}
};
