import { writable } from "svelte/store";
import type { BeaconWallet as BWT } from '@taquito/beacon-wallet';

export const walletStore = writable<BWT | null>();
export const balanceStore = writable();
export const addressStore = writable<string>();