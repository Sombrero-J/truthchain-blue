import { addressStore } from './wallet';
import { writable } from 'svelte/store';

// Initialize userStore with default values
export const userStore = writable<{
	walletAddress: string | null;
	username: string | null;
	fixedStake: number | null;
	credibility: number | null;
}>({
	walletAddress: '',
	username: null,
	fixedStake: null,
	credibility: null,
});

// Subscribe to addressStore to update the walletAddress inside userStore
addressStore.subscribe((walletAddress) => {
	// Update the userStore with the new walletAddress and keep other values intact
	userStore.update((currentUser) => ({
		...currentUser, // Keep existing properties (username, fixedStake, credibility)
		walletAddress // Update the walletAddress with the new value
	}));
});
