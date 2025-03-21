import { fetchAccountInfo, fetchMachines, launchMachine } from '$lib/server/fetch';
import { PRIVATE_API_URL } from '$env/static/private';
import { redirect } from '@sveltejs/kit';

export async function load({ locals, setHeaders }) {

  setHeaders({
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    Pragma: 'no-cache',
    Expires: '0'
  });

  const user = locals.user;

  if (!user) {
    throw redirect(302, '/');
  }

  const accountInfo = await fetchAccountInfo(user.ntag);
  const machines = await fetchMachines();
  if (accountInfo) {
    if (accountInfo.role?.name === "ADMIN") {
      throw redirect(302, '/admin');
    } else {
      return { accountInfo, machines };
    }
  } else {
    throw redirect(302, '/?error=404');
  }
}

export const actions = { 
  launchMachine: async ({ request }) => {
    const data = await request.formData();

    const ntag = data.get('ntag');
    const machine = data.get('machine_id');

    const return_data = await launchMachine(ntag, machine);
    if(return_data.statusCode === 200) {
      return { success: true, data: return_data.data };
    } else {
      return { success: false, data: return_data.error };
    }
  },
  rechargeAccount: async ({ request }) => {
    const data = await request.formData();
    const rfid = data.get('rfid');
    const amount = data.get('amount');
    const accountInfo = await fetchAccountInfo(rfid);
    return accountInfo;
  }
}