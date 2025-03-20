import { db } from '$lib/database';

/**
 * Créer un dépôt d'espèces
 * @param {string} location - L'emplacement du dépôt d'espèces
 * @param {string} accountId - L'identifiant du compte
 * @param {number} amount - Le montant du dépôt
 * @returns {object} - Le dépôt d'espèces créé
 */
async function createCashDeposit(location, accountId, amount) {
  if (!location || !accountId || !amount) {
    throw new Error('L\'emplacement, l\'identifiant du compte et le montant sont requis');
  }

  const cashDeposit = await db.cashDeposit.create({
    data: {
      location,
      accountId,
      amount
    }
  });
  return cashDeposit;
}

/**
 * Obtenir un dépôt d'espèces par ID
 * @param {string} id - L'identifiant du dépôt d'espèces
 * @returns {object} - Le dépôt d'espèces
 */
async function getCashDepositById(id) {
  if (!id) {
    throw new Error('L\'identifiant est requis');
  }

  const cashDeposit = await db.cashDeposit.findUnique({
    where: { id }
  });
  return cashDeposit;
}

/**
 * Obtenir les dépôts d'espèces paginés
 * @param {number} page - Le numéro de page
 * @param {number} take - Nombre d'éléments par page
 * @returns {object[]} - Tableau de dépôts d'espèces
 */
async function getCashDepositPaginated(page, take) {
  if (!page || !take) {
    throw new Error('La page et le nombre d\'éléments sont requis');
  }

  const cashDeposits = await db.cashDeposit.findMany({
    skip: (page - 1) * take,
    take
  });
  return cashDeposits;
}

/**
 * Obtenir les dépôts d'espèces par identifiant de compte
 * @param {string} accountId - L'identifiant du compte
 * @returns {object[]} - Tableau de dépôts d'espèces
 */
async function getCashDepositByAccountId(accountId) {
  if (!accountId) {
    throw new Error('L\'identifiant du compte est requis');
  }

  const cashDeposits = await db.cashDeposit.findMany({
    where: { accountId }
  });
  return cashDeposits;
}

export {
  createCashDeposit,
  getCashDepositById,
  getCashDepositPaginated,
  getCashDepositByAccountId
}
