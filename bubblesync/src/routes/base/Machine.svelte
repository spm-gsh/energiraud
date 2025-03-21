<script>
import Icon from '@iconify/svelte';

import MachineDetail from './MachineDetail.svelte';
import MachineLaunch from './MachineLaunch.svelte';

let {
  accountInfo = $bindable(), machines = $bindable(), change_state
} = $props();

let machine_selected = $state(false);
let success_modal = $state(false);

function select_machine(machine, machine_available) {

  if (!machine_available) {
    return;
  }

  if (machine_selected) {
    machine_selected = false;
  } else {
    machine_selected = machine;
  }
}

function reload(new_infos, machine) {
  accountInfo = new_infos;
  machines = machines.map(m => m.id === machine.id ? machine : m);
  machine_selected = false;
  open_success_modal();
}

function open_success_modal() {
  success_modal = true;
}

function close_success_modal() {
  success_modal = false;
}
</script>

<div class="container">
    <div class="header-container">
        <h1>{accountInfo.name}</h1>
        <div class="balance-container">
          <span class="balance">{parseInt(accountInfo.balance/2)} crédit{parseInt(accountInfo.balance/2) > 1 ? 's' : ''}</span>
        </div>
    </div>

    {#if !machines || machines.length === 0}
    <div class="error-container">
        <h1 class="error-text">Pas de machines disponibles</h1>
        <p class="error-text">Veuillez contacter l'assistance</p>
    </div>
    {/if}

    {#if machine_selected}
      <div class="machine-launch-container">
        <MachineLaunch machine={machine_selected} ntag={accountInfo.ntag} reload={reload}/>
      </div>
      <button class="return-button btn" onclick={() => machine_selected=false}>
        <Icon icon="lucide:arrow-right" width="64" height="64" color="#8B5CF6" />
      </button>
      {:else}
      <div class="machine-container">
        {#each machines as machine}
          <MachineDetail {machine} select_machine={select_machine} />
        {/each}
      </div>

      <button class="return-button btn" onclick={() => change_state("base")}>
          <Icon icon="lucide:arrow-right" width="64" height="64" color="#8B5CF6" />
      </button>

      {/if}
      </div>

      {#if success_modal}
      <div class="confirmation-modal" onclick={close_success_modal}>
          <div class="confirmation-modal-content" onclick={(e) => e.stopPropagation()}>
              <h2>Succès</h2>
              <p>La machine {machine_selected.name} a été lancée pour 2h ! Merci d'avoir utilisé notre service !</p>
              <div class="modal-buttons">
                  <button type="button" class="modal-btn confirm-btn" onclick={close_success_modal}>
                      <div class="modal-btn-content">
                          <h2>OK</h2>
                          <Icon icon="lucide:check" width="32" height="32" color="#10B981" />
                      </div>
                  </button>
              </div>
          </div>
      </div>
    {/if}
<style>

.machine-container {
  margin: auto;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  padding: 2rem;
}

.machine-launch-container {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 2rem;
}
</style>
