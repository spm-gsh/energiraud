import { json } from '@sveltejs/kit';
import { checkKey } from '$lib/utils';
import { removeAllowedLocation, addAllowedLocation, getAccountByNtag } from '$lib/models/account';
import { getLocationById } from '$lib/models/location';

export async function POST({ request }) {
  const { ntag, location_id } = await request.json()

  // CHECK KEY
  const key = request.headers.get('Authorization')
  if (!checkKey(key)) {
    return json({ statusCode: 401, error: 'Unauthorized' }, { status: 401 })
  }

  // CHECK ACCOUNT EXISTS
  const account = await getAccountByNtag(ntag)
  if (!account) {
    return json({ statusCode: 404, error: 'Account not found' }, { status: 404 })
  }

  // CHECK LOCATION EXISTS
  let location = await getLocationById(location_id)
  if (!location) {
    return json({ statusCode: 404, error: 'Location not found' }, { status: 404 })
  }

  // ADD ALLOWED LOCATION
  const updatedAccount = await addAllowedLocation(account.id, location.id)

  return json({
    statusCode: 200,
    data: updatedAccount
  }, { status: 200 })
}

/**
 * Remove a location from the account's allowed locations
 * @param {Object} request - The request object
 * @param {Object} request.json - The JSON body of the request
 * @param {string} request.json.ntag - The ntag of the account
 * @param {string} request.json.location_id - The id of the location to remove
 * @returns {Object} - The updated account
 */
export async function DELETE({ request }) {
  console.log('DELETE')
  const { ntag, location_id } = await request.json()

  // CHECK KEY
  const key = request.headers.get('Authorization')
  if (!checkKey(key)) {
    return json({ statusCode: 401, error: 'Unauthorized' }, { status: 401 })
  }

  // CHECK ACCOUNT EXISTS
  const account = await getAccountByNtag(ntag)
  if (!account) {
    return json({ statusCode: 404, error: 'Account not found' }, { status: 404 })
  }

  // CHECK LOCATION EXISTS
  let removed_location = await getLocationById(location_id)
  if (!removed_location) {
    return json({ statusCode: 404, error: 'Location not found' }, { status: 404 })
  }

  // REMOVE ALLOWED LOCATION
  const updatedAccount = await removeAllowedLocation(account.id, removed_location.id)

  return json({
    statusCode: 200,
    data: updatedAccount
  }, { status: 200 })
}