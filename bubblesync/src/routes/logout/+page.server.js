import { redirect } from '@sveltejs/kit'

export const load = async ({ setHeaders }) => {
  setHeaders({
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    Pragma: 'no-cache',
    Expires: '0'
  });
  redirect(302, '/')
}

export const actions = {
  default({ cookies }) {
    // eat the cookie
    cookies.set('ntag', '', {
      path: '/',
      httpOnly: true,
      sameSite: 'strict',
      secure: false,
      maxAge: 0,
    })

    redirect(302, '/')
  },
}