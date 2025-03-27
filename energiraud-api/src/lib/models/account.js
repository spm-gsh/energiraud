import { db } from '$lib/database'

/**
 * Get account by ntag
 * @param {string} ntag 
 * @returns {object}
 */
async function getAccount(ntag) {
  const account = await db.account.findUnique({
    where: { ntag }
  })

  if (!account) {
    return null
  }

  return account
} 

/**
 * Get account by id
 * @param {string} id 
 * @returns {object}
 */
async function getAccountById(id) {
  const account = await db.account.findUnique({
    where: { id },
    include: {
      transactions: {
        orderBy: {
          created_at: 'desc'
        },
        take: 10
      },
      role: true,
      allowedLocations: true,
      mainLocation: true,
    },
  })

  if (!account) {
    return null
  }

  return account
}

/**
 * Get account by ntag
 * @param {string} ntag 
 * @returns {object}
 */
async function getAccountByNtag(ntag) {
  const account = await db.account.findUnique({
    where: { ntag },
    include: {
      transactions: {
        orderBy: {
          created_at: 'desc'
        },
        take: 10
      },
      role: true,
      allowedLocations: true,
      mainLocation: true,
    },
  })

  if (!account) {
    return null
  }

  return account
}

/**
 * Check if account is enabled
 * @param {string} id 
 * @returns {boolean}
 */
async function accoutIsEnabled(id) {
  const account = await db.account.findUnique({
    where: { id }
  })
  return account.enabled
}

/**
 * Update account balance
 * @param {string} ntag 
 * @param {number} balance 
 * @returns {object}
 */
async function updateAccount(ntag, balance) {
  const account = await db.account.update({
    where: { ntag },
    data: { balance }
  })
  return account
}

/**
 * Get accounts paginated
 * @param {number} page 
 * @param {number} take 
 * @returns {object[]}
 */
async function getAccountsPaginated(page, take) {
  const accounts = await db.account.findMany({
    skip: (page - 1) * take,
    take,
    include: {
      role: true,
      allowedLocations: true,
      mainLocation: true,
    },
  })
  return accounts
}

/**
 * Balance verification 
 * @param {string} accountId 
 * @returns {object}
 */
async function balanceVerification(accountId) {
  const account = await db.account.findUnique({
    where: { id: accountId },
    include: {
      transactions: true,
      role: true,
      allowedLocations: true,
      mainLocation: true,
    },
  });

  if (!account) {
    throw new Error('Account not found');
  }

  let calculatedBalance = parseFloat(account.transactions.reduce((sum, transaction) => sum + transaction.amount, 0)).toFixed(2);

  account.balance = parseFloat(account.balance).toFixed(2)
  calculatedBalance = parseFloat(calculatedBalance).toFixed(2)

  const isVerified = account.balance === calculatedBalance;

  return {
    transaction_count: account.transactions.length,
    calculated_balance: calculatedBalance,
    current_balance: account.balance,
    is_verified: isVerified,
    is_enabled: account.enabled,
  };
}

/**
 * Create account
 * @param {string} name 
 * @param {string} ntag 
 * @returns {object}
 */
async function createAccount(name, ntag) {

  if (!name || !ntag) {
    throw new Error('Name and ntag are required')
  }

  if (name.length < 3) {
    throw new Error('Name must be at least 3 characters')
  }

  if (ntag.length < 3) {
    throw new Error('Ntag must be at least 3 characters')
  }

  // CHECK IF ACCOUNT EXISTS
  let account = await getAccountByNtag(ntag)
  if (account) {
    throw new Error('Account already exists')
  }

  // CREATE ACCOUNT
  account = await db.account.create({
    data: { name, ntag }
  })

  // RETURN ACCOUNT
  return account
}

/**
 * Get authorized accounts
 * @param {string} location 
 * @returns {object[]}
 */
async function getAuthorizedAccounts(location) {
  const accounts = await db.account.findMany({
    where: { 
      OR: {
        allowedLocations: { some: { name: location } },
        mainLocation: { name: location },
        role: { name: 'ADMIN' },
        role: { name: 'SUPER_ADMIN' },
      }
    },
    select: {
      id: true,
      name: true,
      ntag: true,
    }
  })
  return accounts
}

export { 
  getAccount, 
  updateAccount, 
  getAccountsPaginated, 
  getAccountById, 
  accoutIsEnabled, 
  balanceVerification, 
  getAccountByNtag,
  createAccount
}
