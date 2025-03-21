<script>
  import Icon from '@iconify/svelte';

  let { accountInfo=$bindable(), change_state, resetScreen } = $props();
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
  </div>

  <form method="POST" action="/logout">
    <button class="home-button btn" type="submit">
      <Icon icon="lucide:home" width="64" height="64" color="#8B5CF6" />
    </button>
  </form>
</div>