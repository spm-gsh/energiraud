import { db } from '$lib/database'
import { getAccount } from '$lib/models/account'

/**
 * Get transactions by account id
 * @param {string} accountId 
 * @returns {object[]}
 */
async function getTransactionsByAccountId(accountId) {
  const transactions = await db.transaction.findMany({
    where: { accountId }
  })

  return transactions
}

/**
 * Get transactions by account ntag
 * @param {string} ntag 
 * @returns {object[]}
 */
async function getTransactionsByAccountNtag(ntag) {
  const account = await getAccount(ntag)
  if (!account) {
    return null
  }
  return getTransactionsByAccountId(account.id)
}

/**
 * Get all transactions
 * @returns {object[]}
 */
async function getAllTransactions() {
  const transactions = await db.transaction.findMany()
  return transactions
}

/**
 * Get transactions by id
 * @param {string} id 
 * @returns {object[]}
 */
async function getTransactionById(id) {
  const transactions = await db.transaction.findUnique({ where: { id } })
  return transactions
}

/**
 * Get transactions paginated
 * @param {number} page 
 * @param {number} take 
 * @returns {object[]}
 */
async function getTransactionPaginated(page, take) {
  const transactions = await db.transaction.findMany({
    skip: (page - 1) * take,
    take
  })
  return transactions
}

/**
 * Create a transaction
 * @param {string} accountId 
 * @param {number} amount 
 * @param {string} description 
 * @returns {object}
 */
async function createTransaction(accountId, amount, description) {
  const transaction = await db.transaction.create({
    data: { accountId, amount, description }
  })
  return transaction
}

async function createTransactionFromSync(transactionId, accountId, amount, description, createdAt) {
  const transaction = await db.transaction.create({
    data: { id: transactionId, accountId, amount, description, created_at: createdAt }
  })
  return transaction
}

export { getTransactionsByAccountId, getTransactionsByAccountNtag, createTransaction, getTransactionPaginated, getTransactionById, getAllTransactions, createTransactionFromSync }
