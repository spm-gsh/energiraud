<script>
  import Icon from '@iconify/svelte';
  import { enhance } from '$app/forms';

  let { machine, change_state } = $props();

  let editing = $state(false);
  let switch_ip = $state(machine.switch_ip);
  let switch_port = $state(machine.switch_port);

  async function togglePower(on) {
    // TODO: Implement API call to toggle machine power
  }

  async function updateNetworkSettings() {
    // TODO: Implement API call to update switch_ip and switch_port
    machine.switch_ip = switch_ip;
    machine.switch_port = switch_port;
    editing = false;
  }
</script>

<div class="machine-infos">
  <h1 class="machine-title">{machine.name}</h1>

  <div class="actions">
    <form method="POST" action="?/toggleEnabled" use:enhance={() => {
      return async ({ result, update }  ) => {
        console.log(result);
        if (result.status == 302) {
          window.location.href = result.location;
        } else if (result.data.success) {
          machine = result.data.data.machine;
        } else {
          alert(result.data.data);
        }
      };
    }}>
      <input type="hidden" name="machineId" bind:value={machine.id} />
      <button class="btn action-btn" class:enabled={machine.enabled} type="submit">
        <Icon icon="lucide:power" width="32" height="32" />
        {machine.enabled ? 'Désactiver' : 'Activer'} la machine
      </button>
    </form>
    <button class="btn action-btn success" onclick={() => togglePower(true)}>
      <Icon icon="lucide:power" width="32" height="32" />
      Allumer
    </button>
    <button class="btn action-btn danger" onclick={() => togglePower(false)}>
      <Icon icon="lucide:power-off" width="32" height="32" />
      Éteindre
    </button>
  </div>

  <div class="info-section">
    
    <div class="info-grid">
      <div class="info-card-admin">
        <h3>Informations</h3>
        <div class="info-content">
          <p class="info-content-item">
            <span class="label">Id:</span> 
            <span>{machine.serial_number}</span>
          </p>
          <p class="info-content-item">
            <span class="label">Prix horaire:</span> 
            <span class="price">{machine.hourly_price}€</span>
          </p>
          <p class="info-content-item">
            <span class="label">Localisation:</span> 
            <span>{machine.location}</span>
          </p>
        </div>
      </div>

      <div class="info-card-admin">
        <h3>État</h3>
        <div class="info-content">
          <p class="info-content-item">
            <span class="label">Statut:</span> 
            <span class="status-badge" class:available={machine.status === "Disponible"}>
              {machine.status}
            </span>
          </p>
          <p class="info-content-item">
            <span class="label">État:</span>
            <span class="status-badge" class:enabled={machine.enabled}>
              {machine.enabled ? 'Activée' : 'Désactivée'}
            </span>
          </p>
          <p class="info-content-item">
            <span class="label">Disponible le:</span>
            <span>{new Date(machine.available_at).toLocaleString()}</span>
          </p>
        </div>
      </div>

      <div class="info-card-admin">
        <h3>Réseau</h3>
        <div class="info-content">
          <p class="info-content-item">
            <span class="label">IP:</span> 
            <span>{machine.switch_ip}</span>
          </p>
          <p class="info-content-item">
            <span class="label">Port:</span> 
            <span>{machine.switch_port}</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</div>

<button class="return-button btn" onclick={() => change_state("machine")}>
  <Icon icon="lucide:arrow-right" width="64" height="64" color="#8B5CF6" />
</button>

{#if machine.logs && machine.logs.length > 0}
  <h3 class="log-title">Historique d'utilisation</h3>
{/if}

{#each machine.logs as log}
  <div class="log-entry">
    <span class="log-date">{new Date(log.created_at).toLocaleString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
    <span class="log-name">{log.account?.name || 'Utilisateur inconnu'}</span>
  </div>
{/each}

<style>
  .log-title {
    font-size: 2.5rem;
    color: #8B5CF6;
    margin-bottom: 2rem;
    text-align: center;
  }

  .info-content-item {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    font-size: 2.5rem;
  }

  .machine-infos {
    padding-right: 2rem;
    padding-left: 2rem;
    max-width: 1200px;
    margin: 0 auto;
    min-height: 600px;
    gap: 2rem;
  }

  .machine-title {
    font-size: 3rem;
    color: #8B5CF6;
    text-align: center;
  }

  .info-grid {
    display: flex;
    flex-direction: row;
    gap: 2rem;
    margin-bottom: 2rem;
  }

  .info-card-admin {
    background: #1F2937;
    border-radius: 1rem;
    padding: 1.5rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    color: white;
  }

  .info-card-admin h3 {
    color: #8B5CF6;
    font-size: 1.5rem;
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid #E5E7EB;
    font-size: 4rem;
  }

  .info-content {
    font-size: 1.2rem;
  }

  .label {
    color: #8B5CF6;
    font-weight: 500;
    font-size: 3rem;
  }

  .price {
    color: #10B981;
    font-weight: bold;
  }

  .status-badge {
    display: inline-block;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    font-weight: 500;
    background: #EF4444;
    color: white;
  }

  .status-badge.available,
  .status-badge.enabled {
    background: #10B981;
  }

  .actions {
    display: flex;
    justify-content: center;
    gap: 2rem;
    margin-top: 1rem;
    margin-bottom: 1rem;
  }

  .action-btn {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem 2rem;
    font-size: 1.2rem;
    border-radius: 0.75rem;
    background: #4B5563;
    color: white;
    transition: all 0.2s;
  }

  .action-btn:hover {
    transform: translateY(-2px);
  }

  .action-btn.success {
    background: #10B981;
  }

  .action-btn.danger {
    background: #EF4444;
  }

  .action-btn.enabled {
    background: #EF4444;
  }

  .log-entry {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    background: #1F2937;
    border-radius: 0.5rem;
    padding: 1rem;
    margin: 0.5rem 0;
    color: white;
  }

  .log-date {
    color: #8B5CF6;
    font-size: 1.8rem;
    margin-bottom: 0.5rem;
  }

  .log-name {
    color: #ffffff;
    font-size: 1.8rem;
    margin-bottom: 0.5rem;
  }
</style>