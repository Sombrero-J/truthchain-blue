import { TezosToolkit } from '@taquito/taquito';
const { BeaconWallet } = await import('@taquito/beacon-wallet');
import { BeaconEvent } from '@airgap/beacon-sdk';

const rpcUrl = 'https://ghostnet.ecadinfra.com';

const Tezos = new TezosToolkit(rpcUrl);
const wallet = new BeaconWallet({ name: 'Beacon Docs' });

wallet.client.subscribeToEvent(BeaconEvent.ACTIVE_ACCOUNT_SET, (account) => {
	console.log(`${BeaconEvent.ACTIVE_ACCOUNT_SET} triggered: `, account);
});

try {
	console.log('Requesting permissions...');
	const permissions = await wallet.client.requestPermissions();
	console.log('Got permissions:', permissions.address);
} catch (error) {
	console.error('Got error:', error.message);
}