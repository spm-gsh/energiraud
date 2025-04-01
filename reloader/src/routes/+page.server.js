import { fetchAccountInfo, fetchMachines, launchMachine } from '$lib/server/fetch';
import { redirect, fail } from '@sveltejs/kit';

export async function load({ url, locals, setHeaders }) {
  setHeaders({
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    Pragma: 'no-cache',
    Expires: '0'
  });

  const user = locals.user;
  if (user) {
    return redirect(302, '/reload');
  }

  const error = url.searchParams.get('error');
  return { error };
}

export const actions = {
  login: async ({ cookies, request }) => { 

    const data = await request.formData();
    const ntag = data.get('ntag');
    let accountInfo = null;
    try {
      accountInfo = await fetchAccountInfo(ntag);
    } catch (error) {
      return fail(404, { message: 'Erreur de connexion au serveurs. Veuillez attendre quelques minutes avant de réessayer.' });
    }

    if (accountInfo) {
      cookies.set('ntag', accountInfo.ntag, {
        path: '/',
        httpOnly: true,
        sameSite: 'strict',
        secure: false,
        maxAge: 60 * 5,
      });
      console.log('redirecting to /reload');
      redirect(302, '/reload');
    } else {
      return fail(404, { message: 'Impossible de trouver les informations du compte' });
    }
  }
}
