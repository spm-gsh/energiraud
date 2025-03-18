import { db } from '$lib/database';

/**
 * Create a machine log
 * @param {string} machineId - The id of the machine
 * @param {string} accountId - The id of the account
 * @returns {object} - The created machine log
 */
async function createMachineLog(machineId, accountId) {
  if (!machineId || !accountId) {
    throw new Error('Machine ID and Account ID are required');
  }

  const machineLog = await db.machineLog.create({
    data: {
      machineId,
      accountId
    }
  });
  return machineLog;
}

/**
 * Get machine log by ID
 * @param {string} id - The id of the machine log
 * @returns {object} - The machine log
 */
async function getMachineLogById(id) {
  if (!id) {
    throw new Error('ID is required');
  }

  const machineLog = await db.machineLog.findUnique({
    where: { id }
  });
  return machineLog;
}

/**
 * Get machine logs paginated
 * @param {number} page - The page number
 * @param {number} take - Number of items per page
 * @returns {object[]} - Array of machine logs
 */
async function getMachineLogsPaginated(page, take) {
  if (!page || !take) {
    throw new Error('Page and take are required');
  }

  const machineLogs = await db.machineLog.findMany({
    skip: (page - 1) * take,
    take
  });
  return machineLogs;
}

/**
 * Get machine logs by machine ID
 * @param {string} machineId - The id of the machine
 * @returns {object[]} - Array of machine logs
 */
async function getMachineLogsByMachineId(machineId) {
  if (!machineId) {
    throw new Error('Machine ID is required');
  }

  const machineLogs = await db.machineLog.findMany({
    where: { machineId }
  });
  return machineLogs;
}

/**
 * Get machine logs by account ID
 * @param {string} accountId - The id of the account
 * @returns {object[]} - Array of machine logs
 */
async function getMachineLogsByAccountId(accountId) {
  if (!accountId) {
    throw new Error('Account ID is required');
  }

  const machineLogs = await db.machineLog.findMany({
    where: { accountId }
  });
  return machineLogs;
}

export {
  createMachineLog,
  getMachineLogById,
  getMachineLogsPaginated,
  getMachineLogsByMachineId,
  getMachineLogsByAccountId
}
