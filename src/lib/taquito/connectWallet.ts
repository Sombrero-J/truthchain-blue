import BigNumber from 'bignumber.js';
import { TezosToolkit } from '@taquito/taquito';
import { BeaconWallet } from '@taquito/beacon-wallet';
import { NetworkType, type AccountInfo, type DAppClientOptions } from '@airgap/beacon-sdk';
import { walletStore, balanceStore, addressStore } from '$lib/stores/wallet';

const rpcUrl = 'https://ghostnet.ecadinfra.com';

walletStore.subscribe(value => {
	console.log('Wallet store updated:', value);
});

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
		walletStore.set(walletInstance); // Store wallet in store
		initializeTezosToolkit().setWalletProvider(walletInstance); // Set wallet provider
	}
	return walletInstance;
};

export const connectWallet = async () => {
	const wallet = initializeWallet();
	try {
		await wallet.requestPermissions();
		const address = await wallet.getPKH();
		addressStore.set(address);
		if (address && !await checkUserEntry(address)) {
			await insertUser(address);
			addressStore.set(address);
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
	console.log("account found," , activeAccount);
	if (activeAccount) {
		// User already has account connected, everything is ready
		addressStore.set(activeAccount.address);
		await getWalletBalance(activeAccount.address);
		if (!(await checkUserEntry(activeAccount.address))) {
			await insertUser(activeAccount.address);
			return activeAccount;
		} else {
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