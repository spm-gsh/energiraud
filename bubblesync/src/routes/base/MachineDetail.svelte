<script>
  import Icon from '@iconify/svelte';

  let { machine, select_machine } = $props();

  let machine_available = $derived(
    new Date(machine.available_at) < new Date() && machine.enabled && (machine.status === "Disponible" || !machine.status)
  );
</script>

<button class="card btn" onclick={() => select_machine(machine, machine_available)}>
  <div class="machine-card-content">
    <div class="card-header">
      <h2>{machine.name}</h2>
      <div class="status-badge" class:enabled={machine_available} class:disabled={!machine_available}>
        {#if machine_available}
          <Icon icon="lucide:check" width="48" height="48" color="#fff" />
        {:else}
          <Icon icon="lucide:x" width="48" height="48" color="#fff" />
        {/if}
      </div>
    </div>

    <div class="info-card">
      {#if !machine_available}
        <div class="info-section">
          <Icon icon="lucide:calendar" width="48" height="48" color="#8B5CF6" />
          <div class="info-text">
            <p class="info-label">Disponibilité</p>
            <p class="info-value">{new Date(machine.available_at).toLocaleString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</p>
          </div>
        </div>
      {:else}
        <div class="info-section">
          <Icon icon="lucide:calendar" width="48" height="48" color="#8B5CF6" />
          <div class="info-text">
            <p class="info-label">Etat</p>
            <p class="info-value">{machine.status}</p>
          </div>
        </div>
      {/if}
    </div>
  </div>
</button>

<style>
  .card {
    width: 400px;
    height: 300px;
  }

  .machine-card-content {
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 1.5rem;
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    margin-bottom: 1.5rem;
  }

  .card-header h2 {
    font-size: 2.5rem;
    margin: 0;
  }

  .status-badge {
    padding: 0.75rem;
    border-radius: 0.75rem;
    background: #1F2937;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .status-badge.enabled {
    background: #10B981;
  }

  .status-badge.disabled {
    background: #EF4444;
  }

  .info-section {
    display: flex;
    align-items: center;
    gap: 1.5rem;
  }

  .info-section.empty {
    height: 120px;
  }

  .info-text {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .info-label {
    color: #9CA3AF;
    font-size: 1.5rem;
    margin: 0;
  }

  .info-value {
    color: #E5E7EB;
    font-size: 2rem;
    margin: 0;
  }
</style>