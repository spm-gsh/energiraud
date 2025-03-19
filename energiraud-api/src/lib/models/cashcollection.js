import { db } from '$lib/database';

/**
 * Create a cash collect
 * @param {string} machineId - The id of the machine
 * @param {string} accountId - The id of the account
 * @returns {object} - The created cash collect
 */
async function createCashCollection(machineId, accountId) {
  if (!machineId || !accountId) {
    throw new Error('Machine ID and Account ID are required');
  }

  const cashCollect = await db.cashCollect.create({
    data: {
      machineId,
      accountId
    }
  });
  return cashCollect;
}

/**
 * Get cash collect by ID
 * @param {string} id - The id of the cash collect
 * @returns {object} - The cash collect
 */
async function getCashCollectionById(id) {
  if (!id) {
    throw new Error('ID is required');
  }

  const cashCollect = await db.cashCollect.findUnique({
    where: { id }
  });
  return cashCollect;
}

/**
 * Get cash collects paginated
 * @param {number} page - The page number
 * @param {number} take - Number of items per page
 * @returns {object[]} - Array of cash collects
 */
async function getCashCollectionPaginated(page, take) {
  if (!page || !take) {
    throw new Error('Page and take are required');
  }

  const cashCollects = await db.cashCollect.findMany({
    skip: (page - 1) * take,
    take
  });
  return cashCollects;
}

/**
 * Get cash collects by machine ID
 * @param {string} machineId - The id of the machine
 * @returns {object[]} - Array of cash collects
 */
async function getCashCollectionByMachineId(machineId) {
  if (!machineId) {
    throw new Error('Machine ID is required');
  }

  const cashCollects = await db.cashCollect.findMany({
    where: { machineId }
  });
  return cashCollects;
}

/**
 * Get cash collects by account ID
 * @param {string} accountId - The id of the account
 * @returns {object[]} - Array of cash collects
 */
async function getCashCollectionByAccountId(accountId) {
  if (!accountId) {
    throw new Error('Account ID is required');
  }

  const cashCollects = await db.cashCollect.findMany({
    where: { accountId }
  });
  return cashCollects;
}

export {
  createCashCollect,
  getCashCollectById,
  getCashCollectsPaginated,
  getCashCollectsByMachineId,
  getCashCollectsByAccountId
}
