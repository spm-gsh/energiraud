<script>
	import { onMount } from 'svelte';
	import { PUBLIC_KEY, PUBLIC_API_URL } from '$env/static/public';
	import BalanceValidity from './BalanceValidity.svelte';

	let rfid_id = $state("");

	let accountInfo = $state(null);
	let rechargeAmount = $state(0);
	let error = $state(null);
	let success = $state(null);
	let transactions = $state([])
	let balanceValidity = $state(null);
	let dash_message = $state("");
	let ndef = $state(null);

	/**
	 * Fetch the account info
	 */
	onMount(async () => {
		if (!("NDEFReader" in window)) {
      return;
    }

		try {
			const ndef = new NDEFReader();
			await ndef.scan();

			ndef.onreading = async (event) => {
				const decoder = new TextDecoder();
				const tagData = event.message.records.map(record => decoder.decode(record.data)).join(", ");
				rfid_id = tagData;
				await loadPage();
			};

    } catch (err) {
			dash_message += "\nErreur lors de l'activation du NFC, " + err;
    }
	});

	/**
	 * Load the page
	 */
	async function loadPage() {
		await fetchAccountInfo();
		await fetchBalanceValidity();
	}

	/**
	 * Fetch the account info
	 */
	async function fetchAccountInfo() {
		const response = await fetch(`${PUBLIC_API_URL}/api/accounts/${rfid_id}`, {
			headers: {
				"Authorization": `${PUBLIC_KEY}`
			}
		});
		if (response.ok) {
			const data = await response.json();
			accountInfo = data.data;
			transactions = accountInfo.transactions;
		} else {
			error = "Erreur lors de la récupération des informations du compte";
		}
	}

	/**
	 * Fetch the transactions
	 */
	async function fetchBalanceValidity() {
		error = null;
		const response = await fetch(`${PUBLIC_API_URL}/api/verify/${rfid_id}`, {
			headers: {
				"Authorization": `${PUBLIC_KEY}`
			}
		});
		if (response.ok) {
			const data = await response.json();
			const balance_data = data.data;
			balanceValidity = balance_data.is_verified;
			console.log(balanceValidity);
		} else {
			error = "Erreur lors de la récupération de la validité du solde";
		}
	}

	/**
	 * Handle the recharge of the account
	 */
	async function handleRecharge() {
		error = null;
		success = null;
		if (rechargeAmount > 0) {	
			const response = await fetch(`${PUBLIC_API_URL}/api/refil`, {
				method: "POST",
				headers: {
					"Authorization": `${PUBLIC_KEY}`
				},
				body: JSON.stringify({ 
					ntag: rfid_id, 
					amount: rechargeAmount,
					description: "Recharge manuelle"
				})
			});
			if (response.ok) {
				success = `Compte rechargé avec succès de ${rechargeAmount}€`;
				rechargeAmount = 0;
				await loadPage();
			} else {
				error = "Erreur lors du rechargement du compte";
			}
		}
	}
</script>

<style>
	:global(body) {
		--primary-color: #000000;
		--text-color: #1a1a1a;
		--text-light: #4a4a4a;
		--border-color: #e0e0e0;
		--success-bg: #e6f4ea;
		--success-text: #1e8e3e;
		--error-bg: #fde7e9;
		--error-text: #d93025;
		--shadow: 0 2px 4px rgba(0,0,0,0.1);
		--hover-bg: #f8f8f8;
	}

	.container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem 1rem;
	}

	.before-scan-container {
		display: flex;
		text-align: center;
		justify-content: center;
		align-items: center;
	}

	.grid-layout {
		display: grid;
		grid-template-columns: 1fr;
		gap: 1.5rem;
		margin-bottom: 2rem;
	}

	@media (min-width: 768px) {
		.grid-layout {
			grid-template-columns: 1fr 1fr;
		}
	}

	.card {
		background: white;
		border: 1px solid var(--border-color);
		padding: 1.5rem;
		border-radius: 4px;
		box-shadow: var(--shadow);
	}

	.card-title {
		font-size: 1.5rem;
		font-weight: 600;
		margin-bottom: 1rem;
		color: var(--text-color);
	}

	.info-text {
		color: var(--text-light);
		margin: 0.5rem 0;
	}

	.balance {
		font-size: 1.5rem;
		font-weight: 600;
		color: var(--primary-color);
	}

	.input-group {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		margin-bottom: 1rem;
	}

	.input-label {
		color: var(--text-light);
	}

	.input-field {
		padding: 0.75rem;
		border: 1px solid var(--primary-color);
		border-radius: 4px;
		font-size: 1rem;
	}

	.button {
		width: 100%;
		padding: 0.75rem;
		background: var(--text-color);
		color: white;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		transition: opacity 0.2s;
	}

	.button:hover {
		opacity: 0.9;
	}

	.table-container {
		overflow-x: auto;
	}

	table {
		width: 100%;
		border-collapse: collapse;
	}

	th {
		text-align: left;
		padding: 1rem;
		color: var(--text-light);
		border-bottom: 2px solid var(--border-color);
	}

	td {
		padding: 1rem;
		border-bottom: 1px solid var(--border-color);
		color: var(--text-light);
	}

	tr:hover {
		background-color: var(--hover-bg);
	}

	.amount-badge {
		padding: 0.25rem 0.75rem;
		border-radius: 4px;
		display: inline-block;
	}

	.amount-positive {
		background-color: var(--success-bg);
		color: var(--success-text);
	}

	.amount-negative {
		background-color: var(--error-bg);
		color: var(--error-text);
	}

	.error-message {
		color: var(--error-text);
		margin-top: 1rem;
	}

	.success-message {
		color: var(--success-text);
		margin-top: 1rem;
	}

	.success-card {
		background-color: var(--success-bg);
		padding: 1rem;
		border-radius: 4px;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.balance-validity {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.end-button {
		background-color: var(--text-color);
		color: white;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		transition: opacity 0.2s;
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		padding: 1rem;
	}

	.before-scan-title {
		text-align: center;
		margin-bottom: 1rem;
		font-size: 2rem;
		font-weight: 600;
		color: var(--text-color);
	}

	.logo-container {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.logo {
		width: 100px;
		height: 100px;
		margin-bottom: 1rem;
	}

	.info-text {
		color: var(--text-light);
		margin: 0.5rem 0;
	}
</style>

{#if success}
	<div 
		class="success-card" 
		onclick={() => success = null}
		onkeydown={(e) => e.key === 'Enter' && (success = null)}
		role="button"
		tabindex="0"
	>
		<p class="success-message">{success}</p>
	</div>
{/if}

{#if accountInfo}
<div class="container">
	<div class="grid-layout">
		<div class="card">
			<div class="balance-validity">
			<h2 class="card-title">Compte actuel</h2>
				<BalanceValidity bind:balance_validity={balanceValidity} />
			</div>
			<div>
				<p class="info-text">Titulaire: {accountInfo.name}</p>
				<p class="info-text">Numéro de compte: {accountInfo.ntag}</p>
				<p class="balance">Solde: {accountInfo.balance}€</p>
			</div>
		</div>

		<div class="card">
			<h2 class="card-title">Recharger le compte</h2>
			<div class="input-group">
				<label for="amount" class="input-label">Montant à recharger (€)</label>
				<input
					type="number"
					id="amount"
					bind:value={rechargeAmount}
					class="input-field"
					min="0"
				/>
				<button onclick={handleRecharge} class="button">
					Recharger
				</button>
				{#if error}
					<p class="error-message">{error}</p>
				{/if}
			</div>
		</div>
	</div>

	<div class="card">
		<h2 class="card-title">Dernières transactions</h2>
		<div class="table-container">
			<table>
				<thead>
					<tr>
						<th>Date</th>
						<th>Description</th>
						<th style="text-align: right;">Montant</th>
					</tr>
				</thead>
				<tbody>
					{#each transactions as transaction}
						<tr>
							<td>{new Date(transaction.created_at).toLocaleDateString('fr-FR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}</td>
							<td>{transaction.description}</td>
							<td style="text-align: right;">
								<span class="amount-badge {transaction.amount > 0 ? 'amount-positive' : 'amount-negative'}">
									{transaction.amount > 0 ? '+' : '-'}{Math.abs(transaction.amount)}€
								</span>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
	</div>
	<button  class="end-button" onclick={() => {
		rfid_id = ""; 
		accountInfo = null;
	}}>
		J'ai terminé !
	</button>
{:else}
<h2 class="before-scan-title">Staff Juicer</h2>
<div class="logo-container">
	<img src="/favicon.png" alt="Staff Juicer" class="logo">
</div>
{#if dash_message}
	<div class="before-scan-container">
		<div class="card">
			<p class="info-text">{dash_message}</p>
		</div>
	</div>
{:else}
	<div class="before-scan-container">
		<div class="card">
			<h2 class="card-title">En attente de scan</h2>
			<p class="info-text">Scannez une carte pour accéder aux informations du compte.</p>
		</div>
	</div>
	{/if}
{/if}

