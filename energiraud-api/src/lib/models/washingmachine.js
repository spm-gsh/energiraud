import { db } from '$lib/database';

async function getWashingMachines() {
  const washingMachines = await db.washingMachine.findMany();
  return washingMachines;
}

async function getWashingMachineFromLocation(location) {
  const washingMachine = await db.washingMachine.findMany({
    where: { location }
  });
  return washingMachine;
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

async function getWashingMachinesPaginated(page, take) {
  const washingMachines = await db.washingMachine.findMany({
    skip: (page - 1) * take,
    take
  });
  return washingMachines;
}

export { getWashingMachines, getWashingMachineById, getWashingMachineBySerialNumber, getWashingMachinesPaginated, getWashingMachineFromLocation };