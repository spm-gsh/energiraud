import { json } from '@sveltejs/kit';
import { checkKey } from '$lib/utils';
import { createTransactionFromSync, getTransactionById } from '$lib/models/transactions';
import { getAccountById, updateAccountById } from '$lib/models/account';

export async function POST({ request,  }) {
  if (request.headers.get('Content-Type') !== 'application/json') { return json({ statusCode: 415, error: 'Unsupported media type' }, { status: 415 })}
  const body_content = await request.json();
  if (Object.keys(body_content).length !== 5) { return json({ statusCode: 400, error: 'Invalid request body' }, { status: 400 })}
  const { transaction_id, account_id, amount, description, created_at } = body_content;

  // CHECK KEY
  const key = request.headers.get('Authorization')
  if (!checkKey(key)) { return json({ statusCode: 401, error: 'Unauthorized' }, { status: 401 })}

  const userLocation = request.headers.get('X-User-Location');
  if (!userLocation) { return json({ statusCode: 400, error: 'No location provided' }, { status: 400 })}

  // GUARDS
  if (!transaction_id) { return json({ statusCode: 400, error: 'Transaction ID is required' }, { status: 400 })}
  if (!account_id)     { return json({ statusCode: 400, error: 'Account ID is required' },     { status: 400 })}
  if (!amount)         { return json({ statusCode: 400, error: 'Amount is required' },         { status: 400 })}
  if (!created_at)     { return json({ statusCode: 400, error: 'Created at is required' },     { status: 400 })}

  // CHECK IF TRANSACTION EXISTS
  const transaction = await getTransactionById(transaction_id)
  if (transaction) {
    return json({ statusCode: 404, error: 'Transaction already exists' }, { status: 404 })
  } 

  // CHECK IF ACCOUNT EXISTS
  const account = await getAccountById(account_id)
  if (!account) {
    return json({ statusCode: 404, error: 'Account not found' }, { status: 404 })
  }
  
  // CREATE TRANSACTION
  const newTransaction = await createTransactionFromSync(transaction_id, account_id, amount, description, created_at)
  // UPDATE ACCOUNT BALANCE
  await updateAccountById(account.id, account.balance + amount)
  return json({ statusCode: 200, data: newTransaction }, { status: 200 })
}
