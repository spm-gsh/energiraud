<script lang="ts">
  import { onMount } from 'svelte';
  import * as swaggerJson from '$lib/swagger.json';
  import SwaggerUI from 'swagger-ui';
  import 'swagger-ui/dist/swagger-ui.css';
 
  onMount(async () => {
   SwaggerUI({
    spec: swaggerJson,
    dom_id: '#swagger-ui-container',
    deepLinking: true,
    displayRequestDuration: true,
    presets: [
      SwaggerUI.presets.apis,
      SwaggerUI.SwaggerUIStandalonePreset
    ],
    layout: "BaseLayout",
   });
  });
 </script>
 
 <svelte:head>
  <title>SwaggerUI</title>
 </svelte:head>
 
 <div id="swagger-ui-container" style="width: 100%; height: 100%;"></div>