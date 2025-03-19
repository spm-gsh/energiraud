import { json } from '@sveltejs/kit';
import { checkKey } from '$lib/utils';
import { getTransactionPaginated } from '$lib/models/transactions';
import { checkIsPositiveInt } from '$lib/utils';
import { getMachinesFromLocation } from '$lib/models/machine';
import { getAccountByNtag } from '$lib/models/account';
import { createCashCollection } from '$lib/models/cashcollection';

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

  // GET ALL TRANSACTIONS
  const transactions = await getTransactionPaginated(page, take)

  // RETURN FINAL VALUES
  return json({
    statusCode: 200,
    data: transactions,
  }, { status: 200 })
}


export async function POST({ request, url }) {
  const { location, ntag } = await request.json()

  // CHECK KEY
  const key = request.headers.get('Authorization')
  if (!checkKey(key)) {
    return json({ statusCode: 401, error: 'Unauthorized' }, { status: 401 })
  }

  // CHECK LOCATION
  if (!location) {
    return json({ statusCode: 400, error: 'Location is required' }, { status: 400 })
  }

  
  const machines = await getMachinesFromLocation(location)
  if (!machines) {
    return json({ statusCode: 400, error: 'This location doesnt have a cash collection machine' }, { status: 400 })
  }

  // CHECK NTAG
  if (!ntag) {
    return json({ statusCode: 400, error: 'NTAG is required' }, { status: 400 })
  }

  // GET ACCOUNT
  const account = await getAccountByNtag(ntag)

  if (!account) {
    return json({ statusCode: 400, error: 'Account not found' }, { status: 400 })
  }

  const cashCollect = await createCashCollection(location, account.id)

  return json({ statusCode: 200, data: cashCollect }, { status: 200 })
}
