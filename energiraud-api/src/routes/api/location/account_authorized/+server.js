import { json } from '@sveltejs/kit';
import { checkKey, checkLocation, checkIsPositiveInt } from '$lib/utils';
import { getAuthorizedAccounts } from '$lib/models/account';

export async function GET({ request, params }) {
  // CHECK KEY
  const key = request.headers.get('Authorization');
  if (!checkKey(key)) {
    return json({ statusCode: 401, error: 'Unauthorized' }, { status: 401 });
  }

  // CHECK LOCATION
  const userLocation = request.headers.get('X-User-Location');
  if (!userLocation) {
    return json({ statusCode: 400, error: 'Location not found' }, { status: 400 });
  }

  const authorizedAccounts = await getAuthorizedAccounts(userLocation);

  // RETURN FINAL VALUES
  return json({
    statusCode: 200,
    data: account,
  }, { status: 200 });
}