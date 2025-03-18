import { db } from '$lib/database';

async function getMachines() {
  const washingMachines = await db.machine.findMany();
  return washingMachines;
}

async function getMachineFromLocation(location) {
  const washingMachine = await db.machine.findMany({
    where: { location },
    include: {
      logs: true
    }
  });
  return washingMachine;
}

async function getMachineById(id) {
  const washingMachine = await db.machine.findUnique({
    where: { id },
    include: {
      logs: true
    }
  });
  return washingMachine;
}

async function getMachineBySerialNumber(serialNumber) {  
  const washingMachine = await db.machine.findUnique({
    where: { serial_number: serialNumber },
    include: {
      logs: true
    }
  });
  return washingMachine;
}

async function getMachinesPaginated(page, take) {
  const washingMachines = await db.machine.findMany({
    skip: (page - 1) * take,
    take,
    include: {
      logs: true
    }
  });
  return washingMachines;
}

async function updateMachine(id, data) {
  const machine = await db.machine.update({
    where: { id },
    data
  });
  return machine;
}

/**
 * Get machine history
 * @param {string} machine_id - The id of the machine
 * @returns {object} - The machine
 */
async function getMachineHistory(machine_id) {
  const machine = await db.machine.findUnique({
    where: { id: machine_id },
    include: {
      logs: true
    }
  });
  return machine;
}


export { 
  getMachines, 
  getMachineById, 
  getMachineBySerialNumber, 
  getMachinesPaginated, 
  getMachineFromLocation, 
  updateMachine,
  getMachineHistory
};