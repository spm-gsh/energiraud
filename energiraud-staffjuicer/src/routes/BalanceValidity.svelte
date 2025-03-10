<script>
  let { balance_validity = $bindable() } = $props();
</script>

<div class="container">
  {#if balance_validity === undefined}
    <div class="badge-undefined">
      <p class="badge-title">Aucune donnée</p>
    </div>
  {:else if balance_validity === true}
    <div class="badge-success">
      <p class="badge-title">Solde vérifié</p>
    </div>
  {:else}
    <div class="badge-error">
      <p class="badge-title">Erreur de solde</p>
    </div>
  {/if}
</div>


<style>
  .container {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .badge-success {
    background-color: var(--success-bg);
    padding: 0.4rem 0.5rem;
    border-radius: 15px;
  }

  .badge-error {
    background-color: var(--error-bg);
    padding: 0.4rem 0.5rem;
    border-radius: 15px;
  }

  .badge-error .badge-title {
    font-size: 0.8rem;
    color: var(--error-text);
    margin: 0;
  }

  .badge-success .badge-title {
    font-size: 0.8rem;
    color: var(--success-text);
    margin: 0;
  }

  .badge-undefined {
    background-color: rgb(201, 201, 201);
    padding: 0.4rem 0.5rem;
    border-radius: 15px;
  }

  .badge-undefined .badge-title {
    font-size: 0.8rem;
    color: black;
    margin: 0;
  }
</style>
