import { json } from '@sveltejs/kit';
import { getMachineById, updateMachine } from '$lib/models/machine';
import { getAccountById } from '$lib/models/account';
import { toggleOff } from '$lib/models/circuit_manager';
import { checkKey } from '$lib/utils';

export async function POST({ request }) {
  const { user_id, machine_id } = await request.json();

  const key = request.headers.get('Authorization')
  if (!checkKey(key)) {
    return json({ statusCode: 401, error: 'Unauthorized' }, { status: 401 })
  }

  if (!machine_id || !user_id) {
    return json({ error: 'Machine ID is required' }, { status: 400 });
  }

  const account = await getAccountById(user_id);

  if (!account) {
    return json({ error: 'Error, contact support' }, { status: 404 });
  }

  if (account.role.name !== 'ADMIN') {
    return json({ error: 'Error, contact support' }, { status: 404 });
  }

  const machine = await getMachineById(machine_id);

  if (!machine) {
    return json({ error: 'Machine not found' }, { status: 404 });
  }

  // On toggle on-off dans la bdd
  const updatedMachine = await updateMachine(machine_id, { status: "En cours" });

  // On toggle on-off par un admin donc aucun delai
  toggleOn(machine.switch_ip, machine.switch_port);

  return json({ machine: updatedMachine }, { status: 200 });
}
