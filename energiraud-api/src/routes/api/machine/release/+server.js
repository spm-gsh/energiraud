import { json } from '@sveltejs/kit';
import { checkIsFloat, checkIsPositiveFloat, checkKey } from '$lib/utils';
import { getAccount, updateAccount } from '$lib/models/account';
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

  return machine
}

/**
 * Launch a machine
 * @param {object} request - The request object
 * @returns {object} - The response
 */
export async function POST({ request }) {

  let { machine_id } = await request.json()

  // CHECK KEY
  const key = request.headers.get('Authorization')
  if (!checkKey(key)) {
    return json({ statusCode: 401, error: 'Unauthorized' }, { status: 401})
  }

  if (!machine_id) {
    return json({ statusCode: 400, error: 'Machine id is required' }, { status: 400})
  }

  // ##### CHECK MACHINE #####
  const machine = checkMachine(machine_id)

  if (!machine) {
    return json({ statusCode: 404, error: 'Machine is not available' }, { status: 404})
  }

  // UPDATE MACHINE
  const return_machine = await updateMachine(machine_id, { status: 'Disponible' })

  // RETURN FINAL VALUES
  return json({
    statusCode: 200,
    data: { machine: return_machine },
  }, { status: 200})
}
