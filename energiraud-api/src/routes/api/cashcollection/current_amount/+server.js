import { json } from '@sveltejs/kit';
import { checkKey } from '$lib/utils';
import { getCurrentAmount } from '$lib/models/cashcollection';

export async function GET({ request, url }) {
  let location = url.searchParams.get('location')

  // CHECK KEY
  const key = request.headers.get('Authorization')
  if (!checkKey(key)) {
    return json({ statusCode: 401, error: 'Unauthorized' }, { status: 401 })
  }

  // CHECK LOCATION
  if (!location) {
    return json({ statusCode: 400, error: 'Location is required' }, { status: 400 })
  }

  // GET CURRENT AMOUNT
  const currentAmount = await getCurrentAmount(location)

  // RETURN FINAL VALUES
  return json({
    statusCode: 200,
    data: currentAmount,
  }, { status: 200 })
}