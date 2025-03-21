<script>
  import Icon from '@iconify/svelte';
  import { onMount } from 'svelte';

  import Base from './Base.svelte';
  import Machine from './Machine.svelte';
  import Recharge from './Recharge.svelte';

  let { data } = $props();

  let refill_account = $state(data.refill_account);
  let refill = $state(data.refill);
  let current_cash_collection = $state(data.current_cash_collection);

  let accountInfo = $state(data.accountInfo);
  let machines = $state(data.machines);
  let current_state = $state("base");

  onMount(() => {
    if (refill) {
      current_state = "recharge";
    }
  });

  function change_state(state) {
    current_state = state;
  }
</script>

{#if current_state === "base"}
  <Base bind:accountInfo={accountInfo} bind:current_cash_collection={current_cash_collection} change_state={change_state}/>
{:else if current_state === "machine"}
  <Machine bind:accountInfo={accountInfo} bind:machines={machines} change_state={change_state}/>
{:else if current_state === "recharge"}
  <Recharge bind:accountInfo={accountInfo} bind:refill_account={refill_account} change_state={change_state}/>
{/if}