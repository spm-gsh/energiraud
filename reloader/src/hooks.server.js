import { fetchAccountInfo } from '$lib/server/fetch'

export const handle = async ({ event, resolve }) => {
  // get cookies from browser
  const ntag = event.cookies.get('ntag')
  
  event.locals.user = null
  if (!ntag) {
    // if there is no session load page as normal
    return await resolve(event)
  }

  // find the user based on the session
  const user = await fetchAccountInfo(ntag)
  // if `user` exists set `events.local`
  if (user) {
    event.locals.user = user
  }

  // load page as normal
  return await resolve(event)
}