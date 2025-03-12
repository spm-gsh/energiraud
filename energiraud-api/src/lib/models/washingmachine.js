import { db } from '$lib/database';

async function getWashingMachines() {
  const washingMachines = await db.washingMachine.findMany();
  return washingMachines;
}

async function getWashingMachineById(id) {
  const washingMachine = await db.washingMachine.findUnique({
    where: { id }
  });
  return washingMachine;
}

async function getWashingMachineBySerialNumber(serialNumber) {  
  const washingMachine = await db.washingMachine.findUnique({
    where: { serial_number: serialNumber }
  });
  return washingMachine;
}

export { getWashingMachines, getWashingMachineById, getWashingMachineBySerialNumber };