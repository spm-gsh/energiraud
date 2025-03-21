<script>
  import Icon from '@iconify/svelte';
  import CashCollection from './CashCollection.svelte';

  let { accountInfo=$bindable(), current_cash_collection=$bindable(), change_state } = $props();

  let cash_collection_open = $state(false);

  function openCashCollection() {
    cash_collection_open = true;
  }

  function closeCashCollection() {
    cash_collection_open = false;
  }
</script>

<div class="container">
  <div class="header-container">
    <h1>{accountInfo.name}</h1>
  </div>

  <div class="row-container">
    <button class="card btn" onclick={() => change_state("machine")}>
      <div class="card-content">
        <Icon icon="lucide:washing-machine" width="128" height="128" color="#8B5CF6" />
        <div class="card-text">
          <h2>Machines</h2>
          <p>Accédez aux machines à laver</p>
        </div>
      </div>
    </button>
  
    <button class="card btn" onclick={() => change_state("recharge")}>
      <div class="card-content">
        <Icon icon="lucide:credit-card" width="128" height="128" color="#8B5CF6" />
        <div class="card-text">
          <h2>Recharge</h2>
          <p>Ajoutez du crédit sur une carte</p>
        </div>
      </div>
    </button>

    <button class="card btn" onclick={() => openCashCollection()}>
      <div class="card-content">
        <Icon icon="lucide:coins" width="128" height="128" color="#8B5CF6" />
        <div class="card-text">
          <h2>Collecte ({current_cash_collection}€)</h2>
          <p>Récupérez l'argent des machines</p>
        </div>
      </div>
    </button>
  </div>

  <form method="POST" action="/logout">
    <button class="home-button btn" type="submit">
      <Icon icon="lucide:home" width="64" height="64" color="#8B5CF6" />
    </button>
  </form>

  {#if cash_collection_open}
    <CashCollection ntag={accountInfo.ntag} closeCashCollection={closeCashCollection} bind:current_cash_collection={current_cash_collection}/>
  {/if}
</div>