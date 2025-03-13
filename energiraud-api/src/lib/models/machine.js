import { db } from '$lib/database';

async function getMachines() {
  const washingMachines = await db.machine.findMany();
  return washingMachines;
}

async function getMachineFromLocation(location) {
  const washingMachine = await db.machine.findMany({
    where: { location }
  });
  return washingMachine;
}

async function getMachineById(id) {
  const washingMachine = await db.machine.findUnique({
    where: { id }
  });
  return washingMachine;
}

async function getMachineBySerialNumber(serialNumber) {  
  const washingMachine = await db.machine.findUnique({
    where: { serial_number: serialNumber }
  });
  return washingMachine;
}

async function getMachinesPaginated(page, take) {
  const washingMachines = await db.machine.findMany({
    skip: (page - 1) * take,
    take
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

export { getMachines, getMachineById, getMachineBySerialNumber, getMachinesPaginated, getMachineFromLocation, updateMachine };