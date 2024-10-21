<script lang="ts">
	export let date: string | Date = '';
	export let stake: BigNumber | string;
	export let username: string | null;
	export let credibility: string | null;

	import Icon from '../basic/icon.svelte';
	import BigNumber from 'bignumber.js';

	let trimmedStake: string = "0";

	const formattedDate = new Date(date);

	const userFriendlyDate = formattedDate.toLocaleString('en-GB', {
		year: 'numeric',
		month: '2-digit', 
		day: '2-digit', 
		hour: '2-digit', 
		minute: '2-digit',
		hour12: false 
	});

	$: {
		if (stake) {
			trimmedStake = parseFloat(
				stake.toString().replace(/(\.\d*[1-9])0+$|\.0*$/, '$1')
			).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 20 });
		} else {
			trimmedStake = "0";
		}
	}
</script>

<section>
	<div class="metric">
		<div class="metadata__item">
			<Icon name="profile" width="28px" height="28px" />
			<p>{username}</p>
		</div>
		<div class="metadata__item">
			<p>{userFriendlyDate}</p>
		</div>
	</div>
	<div class="metric">
		<div class="metadata__item">
			<Icon name="tezos" width="14px" height="18px" viewBoxValues={[0, 0, 14, 18]} />
			<p>{trimmedStake}</p>
		</div>
		<div class="metadata__item">
			<Icon name="credibility" width="18px" height="18px" viewBoxValues={[0, 0, 18, 21]} />
			<p>{credibility}</p>
		</div>
	</div>
</section>

<style lang="scss">
	.metric {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.3125rem;
	}
	section {
		font-family: $primary-font;
		color: $color-metadata-gray;
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
	}

	.metadata__item {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.3125rem;
	}
</style>
