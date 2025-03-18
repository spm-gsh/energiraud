import { json } from '@sveltejs/kit';
import { checkKey } from '$lib/utils';
import { getMachineLogsByMachineId } from '$lib/models/machinelog';
import { getMachineById } from '$lib/models/machine';

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

  return machine
}

/**
 * Launch a machine
 * @param {object} request - The request object
 * @returns {object} - The response
 */
export async function GET({ request, params }) {  
  const machine_id = params.machine_id

  // CHECK KEY
  const key = request.headers.get('Authorization')
  if (!checkKey(key)) {
    return json({ statusCode: 401, error: 'Unauthorized' }, { status: 401})
  }

  // ##### CHECK MACHINE #####
  let machine = await checkMachine(machine_id)

  if (!machine) {
    return json({ statusCode: 404, error: 'Machine not found' }, { status: 404})
  }

  // GET MACHINE HISTORY
  const machine_history = await getMachineLogsByMachineId(machine.id)

  // RETURN FINAL VALUES
  return json({
    statusCode: 200,
    data: { machine_history },
  }, { status: 200})
}
