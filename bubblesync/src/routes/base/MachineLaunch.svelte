<script>
  import Icon from '@iconify/svelte';
  import { enhance } from "$app/forms";

  let { machine, ntag, reload } = $props();

  let confirmation_modal = $state(false);
  let error_modal = $state(false);
  let error_text = $state("");

  function close_error_modal() {
    error_modal = false;
    error_text = "";
  }

  function open_error_modal(text) {
    error_modal = true;
    error_text = text;
  }

  function close_confirmation_modal() {
    confirmation_modal = false;
  }

  function open_confirmation_modal() {
    confirmation_modal = true;
  }

  let machine_available = $derived(
    new Date(machine.available_at) < new Date() && machine.enabled && (machine.status === "Disponible" || !machine.status)
  );
</script>

<div class="machine-card-content-info">
  <div class="info-card">
    <div class="card-header">
      <h2>{machine.name}</h2>
      <div class="status-badge" class:enabled={machine_available} class:disabled={!machine_available}>
        {machine_available ? 'Disponible' : 'Indisponible'}
      </div>
    </div>
    <div class="info-section">
        <Icon icon="lucide:euro" width="48" height="48" color="#8B5CF6" />
      <div class="info-text">
        <p class="info-label">Total</p>
        <p class="info-value">{machine.hourly_price} credit</p>
      </div>
    </div>

    <div class="info-section">
      <Icon icon="lucide:calendar" width="48" height="48" color="#8B5CF6" />
      <div class="info-text">
        <p class="info-label">Heure de fin</p>
        <p class="info-value">{new Date(new Date().getTime() + 2 * 60 * 60 * 1000).toLocaleString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</p>
      </div>
    </div>
  </div>

</div>
{#if machine_available}
  <button class="launch-btn card btn" onclick={() => {
    open_confirmation_modal();
  }}>
    <div class="launch-content">
      <h2>Lancer</h2>
      <Icon icon="lucide:check" width="48" height="48" color="#8B5CF6" />
    </div>
  </button>
{/if}

{#if confirmation_modal}
  <div class="confirmation-modal" onclick={close_confirmation_modal}>
    <div class="confirmation-modal-content" onclick={(e) => e.stopPropagation()}>
      <h2>Confirmation</h2>
      <p>Vous allez lancer la machine {machine.name} pour {machine.hourly_price} credit.</p>
      <form method="POST" action="?/launchMachine" use:enhance = {() => {
        return async ({result, update}) => {
          if (result.data.success) {
            const data_account = result.data.data.account;
            const data_machine = result.data.data.machine;
            console.log(data_account, data_machine);
            reload(data_account, data_machine);
            close_confirmation_modal();
          } else {
            close_confirmation_modal();
            open_error_modal(result.data.data);
          }
        }
      }}>
        <input type="hidden" name="machine_id" value={machine.id} />
        <input type="hidden" name="ntag" value={ntag} />
        <div class="modal-buttons">
          <button type="button" class="modal-btn cancel-btn" onclick={close_confirmation_modal}>
            <div class="modal-btn-content">
              <h2>Non</h2>
              <Icon icon="lucide:x" width="32" height="32" color="#EF4444" />
            </div>
          </button>
          <button type="submit" class="modal-btn confirm-btn">
            <div class="modal-btn-content">
              <h2>Oui</h2>
              <Icon icon="lucide:check" width="32" height="32" color="#10B981" />
            </div>
          </button>
        </div>
      </form>
    </div>
  </div>
{/if}

{#if error_modal}
  <div class="confirmation-modal" onclick={close_confirmation_modal}>
    <div class="confirmation-modal-content" onclick={(e) => e.stopPropagation()}>
      <h2>Erreur</h2>
      <p>{error_text}</p>
      <div class="modal-buttons">
        <button type="button" class="modal-btn cancel-btn" onclick={close_error_modal}>
          <div class="modal-btn-content">
            <h2>OK</h2>
            <Icon icon="lucide:x" width="32" height="32" color="#EF4444" />
          </div>
        </button>
      </div>
    </div>
  </div>
{/if}