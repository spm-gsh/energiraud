<script>
  import Icon from '@iconify/svelte';
  import { enhance } from '$app/forms';
  import { goto } from '$app/navigation';

  let { ntag, closeCashCollection, current_cash_collection=$bindable() } = $props();
</script>

<div class="confirmation-modal" onclick={closeCashCollection}>
  <div class="confirmation-modal-content" onclick={(e) => e.stopPropagation()}>
    <h2>Confirmation</h2>
    <p>Je valide la collecte des pièces</p>
    <form method="POST" action="?/cashCollection" use:enhance = {() => {
      return async ({result, update}) => {
        if (result.status === 302) {
          goto(result.location);
        }
        if (result.data.success) {
          current_cash_collection = result.data.amount;
          update();
          closeCashCollection();
        } else {
          closeCashCollection();
        }
      }
    }}>
      <input type="hidden" name="ntag" value={ntag} />
      <div class="modal-buttons">
        <button type="button" class="modal-btn cancel-btn" onclick={closeCashCollection}>
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