<script>
  import Icon from '@iconify/svelte';

  let { accountInfo=$bindable(), change_state } = $props();
</script>

<div class="container">
  <div class="header-container">
    <h1>{accountInfo.name}</h1>
    <div class="balance-container">
      <span class="balance">{parseInt(accountInfo.balance/2)} crédit{parseInt(accountInfo.balance/2) > 1 ? 's' : ''}</span>
    </div>
  </div>

  <div class="error-container">
    <h1 class="error-text">Pas disponible</h1>
    <p class="error-text">Cette fonctionnalité n'est pas disponible pour le moment</p>
  </div>

  <button class="return-button btn" onclick={() => change_state("base")}>
    <Icon icon="lucide:arrow-right" width="64" height="64" color="#8B5CF6" />
  </button>
</div>