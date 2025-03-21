import { fetchAccountInfo, fetchMachines, launchMachine } from '$lib/server/fetch';
import { redirect } from '@sveltejs/kit';

export async function load({ url, locals, setHeaders }) {
  setHeaders({
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    Pragma: 'no-cache',
    Expires: '0'
  });

  if (locals.user) {
    if (locals.user.role?.name === "ADMIN") {
      redirect(302, '/admin');
    } else if (locals.user.role?.name === "SUPER_ADMIN") {
      redirect(302, '/super-admin');
    } else {
      redirect(302, '/base');
    }
  }

  const error = url.searchParams.get('error');
  return { error };
}

export const actions = {
  login: async ({ cookies, request }) => { 

    const data = await request.formData();
    const ntag = data.get('ntag');
    const accountInfo = await fetchAccountInfo(ntag);
    if (accountInfo) {
      cookies.set('ntag', accountInfo.ntag, {
        path: '/',
        httpOnly: true,
        sameSite: 'strict',
        secure: false,
        maxAge: 60 * 5,
      });
      if (accountInfo.role?.name === "ADMIN") {
        throw redirect(302, '/admin');
      } else if (accountInfo.role?.name === "SUPER_ADMIN") {
        throw redirect(302, '/super-admin');
      } else {
        throw redirect(302, '/base');
      }
    } else {
      throw redirect(302, '?error=404');
    }
  }
}
