import { json } from '@sveltejs/kit';
import { checkIsFloat, checkIsPositiveFloat, checkKey } from '$lib/utils';
import { getAccount, updateAccount, balanceVerification } from '$lib/models/account';
import { createTransaction } from '$lib/models/transactions';
import { getMachineById, updateMachine } from '$lib/models/machine';

/**
 * Check if the machine exists
 * @param {string} machine_id - The id of the machine
 * @returns {object} - The machine
 */
async function checkMachine(machine_id) {
  // guards
  if (!machine_id) { return false }

  const machine = await getMachineById(machine_id)

  // checks
  if (!machine) { return false }
  if (!machine.enabled) { return false }
  if (machine.available_at && machine.available_at > new Date()) { return false }
  if (machine.status !== '' && machine.status !== 'En attente') { return false }

  return machine
}

/**
 * Check if the account exists  
 * @param {string} ntag - The ntag of the account
 * @returns {object} - The account
 */
async function checkAccount(ntag) {
  if (!ntag) { return false }

  const account = await getAccount(ntag)

  if (!account) { return false }
  if (!account.enabled) { return false }
  const verification_data = await balanceVerification(account.id)
  if (!verification_data.is_verified) { return false }

  return account
}

/**
 * Launch a machine
 * @param {object} request - The request object
 * @returns {object} - The response
 */
export async function POST({ request }) {

  let { ntag, machine_id } = await request.json()

  // CHECK KEY
  const key = request.headers.get('Authorization')
  if (!checkKey(key)) {
    return json({ statusCode: 401, error: 'Unauthorized' }, { status: 401})
  }

  // De base on lance 2h
  const launch_time = 2;

  if (!ntag || ntag === '') {
    return json({ statusCode: 400, error: 'Ntag is required' }, { status: 400})
  }

  if (!machine_id || machine_id === '') {
    return json({ statusCode: 400, error: 'Machine id is required' }, { status: 400})
  }

  // ##### CHECK MACHINE #####
  let machine = await checkMachine(machine_id)

  if (!machine) {
    return json({ statusCode: 404, error: 'Machine is not available' }, { status: 404})
  }

  // ##### CHECK ACCOUNT #####
  let account = await checkAccount(ntag)

  if (!account) {
    return json({ statusCode: 404, error: 'Account error' }, { status: 404})
  }

  // ##### CHECK COST #####
  const cost = launch_time * machine.hourly_price

  if (account.balance < cost) {
    return json({ statusCode: 400, error: 'Insufficient balance, need ' + cost + '€' }, { status: 400})
  }

  // CREATE TRANSACTION
  await createTransaction(account.id, -cost, 'Utilisation ' + machine.name + ' (' + launch_time + 'h)')

  account = await updateAccount(ntag, account.balance - cost)

  // UPDATE MACHINE
  machine = await updateMachine(machine.id, { status: 'En cours', available_at: new Date(Date.now() + launch_time * 60 * 60 * 1000) })

  // RETURN FINAL VALUES
  return json({
    statusCode: 200,
    data: { machine, account },
  }, { status: 200})
}
