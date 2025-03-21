<script>
  import Icon from '@iconify/svelte';

  import Base from './Base.svelte';
  import Machine from './Machine.svelte';
  import Recharge from './Recharge.svelte';

  let { data } = $props();

  let accountInfo = $state(data.accountInfo);
  let machines = $state(data.machines);
  let current_state = $state("base");

  function change_state(state) {
    current_state = state;
  }
</script>

{#if current_state === "base"}
  <Base bind:accountInfo={accountInfo} change_state={change_state}/>
{:else if current_state === "machine"}
  <Machine bind:accountInfo={accountInfo} bind:machines={machines} change_state={change_state}/>
{:else if current_state === "recharge"}
  <Recharge bind:accountInfo={accountInfo} change_state={change_state}/>
{/if}