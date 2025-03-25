import { json } from '@sveltejs/kit';
import { checkKey, checkLocation, checkIsPositiveInt } from '$lib/utils';
import { getAccountById, getAccountByNtag } from '$lib/models/account';

export async function GET({ request, params }) {
  const account_id = params.account_id;

  // CHECK KEY
  const key = request.headers.get('Authorization');
  if (!checkKey(key)) {
    return json({ statusCode: 401, error: 'Unauthorized' }, { status: 401 });
  }

  // GET ACCOUNT INFO
  let account = await getAccountById(account_id);
  if (!account) {
    account = await getAccountByNtag(account_id);
  }

  if (!account) {
    return json({ statusCode: 404, error: 'Account not found' }, { status: 404 });
  }

  if (!account.enabled) {
    return json({ statusCode: 403, error: 'Account is not active' }, { status: 403 });
  }

  // CHECK LOCATION
  const userLocation = request.headers.get('X-User-Location');
  console.log(userLocation);
  if (!checkLocation(userLocation, account)) {
    return json({ statusCode: 403, error: 'Location not allowed' }, { status: 403 });
  }

  // RETURN FINAL VALUES
  return json({
    statusCode: 200,
    data: account,
  }, { status: 200 });
}