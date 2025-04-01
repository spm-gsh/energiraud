import { redirect, fail } from '@sveltejs/kit';
import { rechargeAccount, fetchAccountInfo } from '$lib/server/fetch';

export async function load({ locals }) {
  if (!locals.user) {
    return redirect(302, '/logout');
  }
  let account = await fetchAccountInfo(locals.user.ntag);
  return { account: account };
}

export const actions = {
  async default({ request, locals }) {
    if (!locals.user) {
      throw redirect(302, '/');
    }

    if (!locals.user.ntag) {
      return fail(404, { message: 'Aucun solde lié à votre compte: contactez un médiateur.' });
    }

    const formData = await request.formData();
    const amount = formData.get('amount');

    if (amount <= 0) {
      return fail(404, { message: 'Erreur de montant de recharge. Veuillez réessayer plus tard.' });
    }

    try {
      const recharge = await rechargeAccount(locals.user.ntag, amount);
      if (!recharge.success) {
        return fail(404, { message: recharge.message });
      }
    } catch (error) {
      return fail(404, { message: 'Erreur lors de la recharge. Veuillez réessayer plus tard.' });
    }

    return { success: true };
  }
}

