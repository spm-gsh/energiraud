<script>
  import Icon from '@iconify/svelte';
  
  import MachineDetail from './MachineDetail.svelte';
  import MachineInfos from './MachineInfos.svelte';

  let {
    accountInfo = $bindable(), machines = $bindable(), change_state
  } = $props();

  let machine_selected = $state(false);

  function select_machine(machine) {
    machine_selected = machine;
  }

</script>
  
<div class="container">
  <div class="header-container">
    <h1>{accountInfo.name}</h1>
  </div>

  {#if !machines || machines.length === 0}
    <div class="error-container">
      <h1 class="error-text">Pas de machines disponibles</h1>
      <p class="error-text">Veuillez contacter l'assistance</p>
    </div>
  {/if}

  {#if machine_selected}
    <MachineInfos machine={machine_selected} change_state={change_state} />
  {:else}
    <div class="machine-container">
      {#each machines as machine}
        <MachineDetail {machine} select_machine={select_machine} />
      {/each}
    </div>
  {/if}
  <button class="return-button btn" onclick={() => change_state("base")}>
    <Icon icon="lucide:arrow-right" width="64" height="64" color="#8B5CF6" />
  </button>
</div>
  
<style>
  .machine-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(600px, 1fr));
    max-width: 1600px;
    margin: 0 auto;
    gap: 2rem;
    padding: 2rem;
  }
</style>
  