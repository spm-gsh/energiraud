<script>
  import Icon from '@iconify/svelte';
  import { azertyToQwerty } from '$lib/util';

  let { data, form } = $props();
  
  let current_ntag = $state('');
  let isValidated = $state(false);
  let showModal = $state(false);
  
  function reset() {
    isValidated = false;
    current_ntag = '';
  }
  
  function toggleModal() {
    showModal = !showModal;
  }

  /**
   * Handle the key down event
   * @param event
   */
  let login_form = $state(null);
  function handleKeydown(event) {
    if (event.key === 'Enter') {
      login_form.submit();
      current_ntag = '';
    } else {
      if (!isNaN(event.key)) {
        current_ntag += event.key;
      } else if (!isNaN(azertyToQwerty(event.key))) {
        current_ntag += azertyToQwerty(event.key);
      }
    }
  }
</script>

<svelte:window onkeydown={handleKeydown} />

<form method="POST" action="?/login" bind:this={login_form}>
  <input hidden type="text" name="ntag" bind:value={current_ntag} />
</form>

<main class="container mx-auto p-4 max-w-4xl min-h-screen flex items-center justify-center">
  <div class="bg-white p-8 rounded-lg shadow-lg w-full">
    <h1 class="text-6xl font-bold mb-8 text-center">Recharger votre compte</h1>
    
    <p class="text-center text-gray-800 text-3xl mb-8">
      Badgez votre carte giraud pour débuter la recharge
    </p>
    
    {#if form?.message}
      <div class="text-center mb-6 p-4 bg-red-100 text-red-700 rounded-md text-2xl font-semibold">
        {form.message}
      </div>
    {/if}
    
    <button 
      onclick={toggleModal} 
      class="w-full bg-black text-white py-6 px-6 rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-black focus:ring-offset-2 text-3xl font-semibold"
    >
      Comment faire ?
    </button>
  </div>
  
  {#if showModal}
    <div class="fixed inset-0 flex items-center justify-center z-50">
      <div class="bg-white p-8 rounded-lg shadow-lg max-w-3xl w-full mx-4">
        <h2 class="text-4xl font-bold mb-6">Comment badger votre carte</h2>
        <div class="mb-8">
          <p class="mb-4 flex items-center text-2xl">
            <Icon icon="lucide:credit-card" class="mr-4" width="36"/>
            Munissez-vous de votre carte Giraud
          </p>
          <p class="mb-4 flex items-center text-2xl">
            <Icon icon="lucide:scan-line" class="mr-4" width="36"/>
            Passez la carte devant le lecteur et attendez un "bip"
          </p>
          <p class="mb-4 flex items-center text-2xl">
            <Icon icon="lucide:wifi" class="mr-4" width="36"/>
            La connexion se fera automatiquement
          </p>
          <p class="mb-4 flex items-center text-2xl">
            <Icon icon="lucide:monitor" class="mr-4" width="36"/>
            Suivez ensuite les instructions à l'écran
          </p>
          <p class="mb-4 flex items-center text-2xl">
            <Icon icon="lucide:log-out" class="mr-4" width="36"/>
            Quittez l'écran de recharge pour finaliser l'opération
          </p>
        </div>
        <button 
          onclick={toggleModal} 
          class="w-full bg-black text-white py-6 px-6 rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-black focus:ring-offset-2 text-3xl font-semibold"
        >
          J'ai compris !
        </button>
      </div>
    </div>
  {/if}
</main>

<style>
  :global(body) {
    background-color: #f9fafb;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    font-size: 18px;
    line-height: 1.5;
    touch-action: manipulation;
  }
  
  button {
    cursor: pointer;
    min-height: 60px;
    touch-action: manipulation;
  }
  
  @media (max-width: 1200px) {
    main {
      padding: 1rem;
    }
  }
</style>
