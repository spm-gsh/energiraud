import { json } from '@sveltejs/kit';
import { checkKey } from '$lib/utils';
import { checkIsPositiveInt } from '$lib/utils';
import { getLocationPaginated } from '$lib/models/location';

export async function GET({ request, url }) {
  let page = url.searchParams.get('page') || 1
  let take = url.searchParams.get('take') || 10

  // CHECK KEY
  const key = request.headers.get('Authorization')
  if (!checkKey(key)) {
    return json({ statusCode: 401, error: 'Unauthorized' }, { status: 401 })
  }

  // CHECK PAGE
  if (!checkIsPositiveInt(page)) {
    return json({ statusCode: 400, error: 'Invalid page' }, { status: 400 })
  }

  page = parseInt(page)

  // CHECK TAKE
  if (!checkIsPositiveInt(take)) {
    return json({ statusCode: 400, error: 'Invalid take' }, { status: 400 })
  }

  take = parseInt(take)

  // Maximum take is 50
  if (take > 50) {
    return json({ statusCode: 400, error: 'Take must be max 50' }, { status: 400 })
  }

  // GET ALL LOCATIONS
  const locations = await getLocationPaginated(page, take)

  // RETURN FINAL VALUES
  return json({
    statusCode: 200,
    data: locations,
  }, { status: 200 })
}