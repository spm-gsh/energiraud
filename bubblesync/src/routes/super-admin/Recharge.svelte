<script>
  import Icon from '@iconify/svelte';
  import { azertyToQwerty } from '$lib/util';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';

  let { accountInfo=$bindable(), refill_account=$bindable(), change_state } = $props();
  let current_rfid = $state("");
  let amount = $state(0);

  onMount(() => {
    console.log("refill_account",refill_account);
  });

  function handle_key_down(event) {
    if (event.key === 'Enter') {
      console.log(current_rfid);
      validateRfid();
      current_rfid = "";
    } else {
      if (!isNaN(event.key)) {
        current_rfid += event.key;
      } else if (!isNaN(azertyToQwerty(event.key))) {
        current_rfid += azertyToQwerty(event.key);
      }
    }
  }

  async function validateRfid() {
    if (!current_rfid) { return; }
    refill_account = null;
    await goto(`/admin?refill_ntag=${current_rfid}`);
    location.reload();
  }

  function incrementAmount() {
    amount += 1;
  }

  function decrementAmount() {
    if (amount > 0) { amount -= 1; }
  }
</script>

<svelte:window on:keydown={handle_key_down} />

<div class="header-container">
  <h1 class="text-2xl font-bold text-gray-800">{accountInfo.name}</h1>
</div>


{#if refill_account}
<h2 class="card-title">Recharger la carte de {refill_account.name}</h2>
<form method="POST" action="?/refillCard" class="recharge-form">
    <div class="amount-container">      
      <div class="amount-control">
        <button 
          type="button"
          class="amount-btn" 
          onclick={decrementAmount}
          aria-label="Diminuer le montant"
        >
          <Icon icon="lucide:minus" width="64" height="64" />
        </button>

        <input 
          type="number"
          id="amount"
          name="amount"
          bind:value={amount}
          min="0"
          class="amount-input"
        />

        <button 
          type="button"
          class="amount-btn"
          onclick={incrementAmount}
          aria-label="Augmenter le montant"
        >
          <Icon icon="lucide:plus" width="64" height="64" />
        </button>
      </div>

    <input type="hidden" name="ntag" value={refill_account.ntag} />
    
    <button type="submit" class="submit-btn">
      <span>Recharger la carte</span>
    </button>
  </form>

  <div class="transaction-container">
    <h2 class="transaction-title">Transactions</h2>
    {#each refill_account.transactions as transaction}
      <div class="transaction-item">
        <div class="first-row">
          <span>{new Date(transaction.created_at).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
          <span class={transaction.amount > 0 ? "credit-row" : "debit-row"}>{transaction.amount}€</span>
        </div>
        <div class="second-row">
          <span>{transaction.description}</span>
        </div>
      </div>
    {/each}
  </div>

{:else}
  <p class="instruction-text">Veuillez scanner la carte à recharger</p>
{/if}

<button class="return-button btn" onclick={() => change_state("base")}>
  <Icon icon="lucide:arrow-right" width="64" height="64" color="#8B5CF6" />
</button>

<style>
  .card-title {
    font-size: 4rem;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 2rem;
    text-align: center;
    color: white;
  }

  .recharge-form {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 2rem;
  }

  .amount-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .amount-control {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    margin-bottom: 5rem;
  }

  .amount-input {
    width: 300px;
    text-align: center;
    padding: 0.5rem;
    border: 2px solid #e5e7eb;
    border-radius: 0.5rem;
    font-size: 1.25rem;
    font-weight: 600;
    font-size: 80px;
  }

  .amount-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 80px;
    height: 80px;
    border-radius: 0.5rem;
    background-color: #8B5CF6;
    color: white;
    border: none;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .amount-btn:hover {
    background-color: #7c3aed;
  }

  .submit-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    background-color: #8B5CF6;
    color: white;
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    font-weight: 500;
    border: none;
    cursor: pointer;
    transition: background-color 0.2s;
    width: 600px;
    font-size: 80px;
  }

  .submit-btn:hover {
    background-color: #7c3aed;
  }

  .instruction-text {
    text-align: center;
    color: white;
    font-size: 3rem;
  }

  .transaction-container {
    margin-top: 2rem;
    width: 100%;
    max-width: 800px;
    margin: 2rem auto;
  }

  .transaction-title {
    font-size: 2rem;
    font-weight: 600;
    color: white;
    margin-bottom: 1rem;
    text-align: center;
  }

  .transaction-item {
    font-size: 2.5rem;
    background-color: #1f2937;
    border-radius: 0.5rem;
    padding: 1rem;
    margin-bottom: 1rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    color: white;
  }

  .first-row {
    display: flex;
    justify-content: space-between;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }

  .second-row {
    color: #6b7280;
  }

  .debit-row {
    color: #ef4444;
  }

  .credit-row {
    color: #22c55e  ;
  }
</style>