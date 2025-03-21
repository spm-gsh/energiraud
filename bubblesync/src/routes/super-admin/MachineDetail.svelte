<script>
  import Icon from '@iconify/svelte';

  let { machine, select_machine } = $props();

  let machine_available = $derived(
    new Date(machine.available_at) < new Date() && machine.enabled && (machine.status === "Disponible" || !machine.status)
  );
</script>

<button class="card btn" onclick={() => {select_machine(machine)}}>
  <div class="machine-card-admin-content">
    <div class="card-header-admin">
      <h2>{machine.name}</h2>
      <div class="status-badge" class:enabled={machine_available} class:disabled={!machine_available}>
        {machine_available ? 'Disponible' : 'Indisponible'}
      </div>
    </div>
  </div>
</button>

<style>

  .machine-card-admin-content {
    padding: 3rem 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .card-header-admin h2 {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    margin: 0;
  }

  .card-header-admin {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }

  .status-badge {
    font-size: 2rem;
    padding: 1rem 2rem;
    border-radius: 1rem;
    background: #1F2937;
    color: #9CA3AF;
    width: 30%;
  }

  .status-badge.enabled {
    background: #10B981;
    color: #FFFFFF;
  }

  .status-badge.disabled {
    background: #EF4444;
    color: #FFFFFF;
  }
</style>