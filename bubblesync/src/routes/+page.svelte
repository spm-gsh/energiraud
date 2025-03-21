<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { azertyToQwerty } from '$lib/util';
  import { enhance } from '$app/forms';

  let bubbles = $state([]);
  const maxBubbles = 0;
  let windowWidth = 0;
  let windowHeight = 0;

  let error = $state("");

  let { data } = $props();
  
  onMount(() => {
    if (data.error) {
      error = data.error;
    }
  });
  
  function createBubble() {
    const bubble = {
      id: Math.random(), // Ajout d'un identifiant unique
      x: Math.random() * windowWidth,
      y: windowHeight + 10, // Commence en dessous de l'écran
      size: Math.random() * 100 + 10,
      speed: Math.random() * 2 + 1,
      horizontalSpeed: (Math.random() - 0.5) * 0.5 // Vitesse horizontale aléatoire
    };
    bubbles.push(bubble);
  }

  function animateBubbles() {
    // Mise à jour des positions sans réorganiser les bulles
    bubbles.forEach(bubble => {
      bubble.y -= bubble.speed;
      bubble.x += bubble.horizontalSpeed;
      
      // Rebondir sur les bords
      if (bubble.x <= 0 || bubble.x >= windowWidth) {
        bubble.horizontalSpeed = -bubble.horizontalSpeed;
      }
    });

    // Filtrer les bulles sorties de l'écran
    bubbles = bubbles.filter(bubble => bubble.y + bubble.size > 0);

    if (bubbles.length < maxBubbles) {
      createBubble();
    }

    requestAnimationFrame(animateBubbles);
  }

  onMount(() => {
    // Mettre à jour les dimensions de la fenêtre
    const updateDimensions = () => {
      windowWidth = window.innerWidth;
      windowHeight = window.innerHeight;
    };
    
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    animateBubbles();

    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  });

  let current_rfid = $state("");

  /**
   * Handle the key down event
   * @param event
   */
  function handle_key_down(event) {
    if (event.key === 'Enter') {
      validateRfid();
    } else {
      if (!isNaN(event.key)) {
        current_rfid += event.key;
      } else if (!isNaN(azertyToQwerty(event.key))) {
        current_rfid += azertyToQwerty(event.key);
      }
    }
  }

  let form = $state(null);
  
  /**
   * Validate the RFID code and redirect to the base page
   */
  async function validateRfid() {
    try {
      if (current_rfid) {
        form.submit();
      }
    } catch (error) {
      console.error(error);
    }
  }
</script>

<svelte:window on:keydown={handle_key_down} />

<form method="POST" action="?/login" bind:this={form}>
  <input hidden type="text" name="ntag" bind:value={current_rfid} />
</form>

<div class="menu-container">
  <h1 class="title">Laverie</h1>

  {#if error === "500"}
    <div class="error-container">
      <h1 class="error-text">Erreur</h1>
      <p class="error-text">Impossible de joindre le serveur</p>
    </div>
  {:else if error === "404"}
    <div class="error-container">
      <h1 class="error-text">Erreur</h1>
      <p class="error-text">Aucun compte associé à cette carte</p>
    </div>
  {/if}

  <div class="touch-container">
    Posez votre carte sur le lecteur
  </div>
  
  {#each bubbles as bubble (bubble.id)}
    <div 
      class="bubble"
      style="
        left: {bubble.x}px;
        top: {bubble.y}px;
        width: {bubble.size}px;
        height: {bubble.size}px;
      "
    ></div>
  {/each}
</div>
