<script>
  import Icon from '@iconify/svelte';
  import Validation from '$lib/components/Validation.svelte';
  import { goto } from '$app/navigation';
  import { enhance } from "$app/forms";

  let { data } = $props();

  let account = $derived(data.account);
  let amount = $state(0);
  let success = $state(false);
  let error = $state(false);

  function resetAmount() {
    amount = 0;
  }
</script>

{#if error}
  <div class="min-h-screen flex items-center justify-center">
    <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-4xl mx-auto">
      <h1 class="text-4xl font-bold mb-6 text-center">Erreur lors de la recharge</h1>
      <p class="text-3xl text-center text-gray-700 mb-8">{error}</p>
      <button 
        class="w-full bg-black text-white py-4 px-6 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-500 focus:ring-offset-2 mt-6 text-3xl font-bold"
        onclick={() => {
          error = false;
        }}
      >
        Retour
      </button>
    </div>
  </div>
{/if}

{#if success}
  <div class="min-h-screen flex items-center justify-center">
    <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-4xl mx-auto">
      <Validation success_text={"Votre compte a été rechargé de "+ amount.toFixed(2) + "€."}/>
    </div>
  </div>
{:else}
  <div class="min-h-screen flex items-center justify-center">
    <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-4xl mx-auto">
      <h1 class="text-4xl font-bold mb-6 text-center">Bonjour, {account?.name || 'utilisateur'}</h1>
      
      <div class="bg-blue-100 p-6 rounded-lg mb-4 border-2 border-blue-300">
        <p class="text-center text-gray-800 text-2xl font-semibold">
          <Icon icon="lucide:info" class="inline mr-3" width="32"/>
          Veuillez insérer des pièces pour recharger votre compte.
        </p>
      </div>
      
      <div class="text-center mb-10">
        <div class="text-7xl font-bold mb-6">{amount.toFixed(2)} €</div>
        <div class="text-xl text-gray-700 mb-8">Montant à recharger</div>

        <div class="flex flex-col md:flex-row justify-between items-center p-6 bg-gray-100 rounded-lg mb-4 border-2 border-gray-300">
          <div class="mb-4 md:mb-0">
            <span class="text-gray-700 text-2xl">Solde actuel:</span>
            <span class="font-bold ml-2 text-2xl">{(((account?.balance || 0)) / 2).toFixed(2)} credits</span>
          </div>
          <div class="text-3xl mb-4 md:mb-0">→</div>
          <div>
            <span class="text-gray-700 text-2xl">Nouveau solde:</span>
            <span class="font-bold ml-2 text-2xl">{(((account?.balance || 0) + amount) / 2).toFixed(2)} credits</span>
          </div>
        </div>
      </div>
      <form 
        method="POST"
        action="/reload"
        use:enhance = {() => {
          return async ({result, update}) => {
            let response = await result;
            console.log(response);
            if (response?.status == 302) {
              goto(response.location);
            } else if (response?.status === 200) {
              success = true;
              update();
              setTimeout(() => {
                success = false;
                resetAmount();
                goto('/logout');
              }, 5000);
            } else {
              error = response?.message || "Une erreur est survenue lors de la recharge. Veuillez réessayer plus tard.";
            }
          }
          }}>
        <input type="hidden" name="amount" value={amount} />
        <button 
          type="submit"
          class="w-full bg-green-600 text-white py-5 px-6 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-offset-2 text-3xl font-bold"
          disabled={amount <= 0}
        >
          Valider la recharge
        </button>
      </form>
    </div>
  </div>
{/if}
