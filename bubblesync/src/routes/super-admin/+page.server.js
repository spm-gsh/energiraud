import { fetchAccountInfo, fetchMachines, createCashCollection, getCurrentCashCollectionAmount } from '$lib/server/fetch';
import { redirect } from '@sveltejs/kit';

export async function load({ url, locals, setHeaders }) {
  setHeaders({
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    Pragma: 'no-cache',
    Expires: '0'
  });

  const refill_ntag = url.searchParams.get('refill_ntag');
  let refill_account = null;
  let refill = false;
  if (refill_ntag) {
    refill_account = await fetchAccountInfo(refill_ntag);
    if (refill_account) {
      refill = true;
    }
  }
  const user = locals.user;
  if (!user) {
    throw redirect(302, '/');
  }
  if (user.role?.name !== "SUPER_ADMIN") {
    throw redirect(302, '/');
  }
  const accountInfo = await fetchAccountInfo(user.ntag);
  const machines = await fetchMachines();
  const current_cash_collection = await getCurrentCashCollectionAmount();

  if (accountInfo) {
    return { accountInfo, machines, refill_account, refill, current_cash_collection: current_cash_collection.data };
  } else {
    throw redirect(302, '/?error=404');
  }
}


export const actions = {
  loadCard: async ({ cookies, request, locals }) => {
    const user = locals.user;
    if (!user) {
      throw redirect(302, '/');
    }
    if (user.role?.name !== "ADMIN" && user.role?.name !== "SUPER_ADMIN") {
      throw redirect(302, '/');
    }
    const data = await request.formData();
    const ntag = data.get('ntag');
    const accountInfo = await fetchAccountInfo(ntag);
    if (accountInfo) {
      return { success: true, data: accountInfo };
    } else {
      return { success: false, data: "Le lien vers le compte n'est pas valide" };
    }
  },  

  refillCard: async ({ cookies, request, locals }) => { 
    const user = locals.user;
    if (!user) {
      throw redirect(302, '/');
    }
    if (user.role?.name !== "ADMIN" && user.role?.name !== "SUPER_ADMIN") {
      throw redirect(302, '/');
    }
    const data = await request.formData();
    const ntag = data.get('ntag');
    const amount = data.get('amount');
    const accountInfo = await fetchAccountInfo(ntag);
    if (accountInfo) {
      const recharge = await rechargeAccount(ntag, amount);
      console.log(recharge);
      if (recharge) {
        return { success: true, data: recharge };
      } else {
        return { success: false, data: "Erreur lors de la recharge" };
      }
    } else {
      return { success: false, data: "Le lien vers le compte n'est pas valide" };
    }
  },

  toggleEnabled: async ({ cookies, request, locals }) => {
    const user = locals.user;
    if (!user) {
      throw redirect(302, '/');
    }
    if (user.role?.name !== "ADMIN" && user.role?.name !== "SUPER_ADMIN") {
      throw redirect(302, '/');
    }
    const data = await request.formData();
    const machineId = data.get('machineId');
    console.log(machineId);
    const toggle = await toggleMachine(machineId, user.id);
    console.log(toggle);
    if (toggle) {
      return { success: true, data: toggle };
    } else {
      return { success: false, data: "Erreur lors de la modification de l'état de la machine" };
    }
  },

  cashCollection: async ({ cookies, request, locals }) => {
    const user = locals.user;
    if (!user) {
      throw redirect(302, '/');
    }
    if (user.role?.name !== "ADMIN" && user.role?.name !== "SUPER_ADMIN") {
      throw redirect(302, '/');
    }
    const data = await request.formData();
    const ntag = data.get('ntag');
    const cashCollection = await createCashCollection(ntag);
    console.log(cashCollection);
    if (cashCollection) {
      return { success: true, data: cashCollection };
    } else {
      return { success: false, data: "Erreur lors de la collecte des pièces" };
    }
  } 
}