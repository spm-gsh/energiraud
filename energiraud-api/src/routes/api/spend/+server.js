/**
 * @swagger
 * /api/spend:
 *   post:
 *     tags:
 *       - Actions
 *     summary: Débite le solde d'un compte
 *     description: Permet de retirer un montant du solde d'un compte utilisateur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ntag
 *               - amount
 *             properties:
 *               ntag:
 *                 type: string
 *                 description: Identifiant NFC du compte
 *               amount:
 *                 type: number
 *                 format: float
 *                 minimum: 0
 *                 description: Montant à débiter du solde
 *     responses:
 *       200:
 *         description: Le compte a été débité avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     ntag:
 *                       type: string
 *                     balance:
 *                       type: number
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                     enabled:
 *                       type: boolean
 *       400:
 *         description: Montant invalide, solde insuffisant ou compte désactivé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 400
 *                 error:
 *                   type: string
 *                   example: Invalid amount
 *       401:
 *         description: Clé d'API invalide ou manquante
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 401
 *                 error:
 *                   type: string
 *                   example: Unauthorized
 *       404:
 *         description: Compte non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 404
 *                 error:
 *                   type: string
 *                   example: Account not found
 *       500:
 *         description: Erreur interne du serveur
 */
import { json } from '@sveltejs/kit';
import { checkIsFloat, checkIsPositiveFloat, checkKey } from '$lib/utils';
import { getAccount, updateAccount } from '$lib/models/account';
import { createTransaction } from '$lib/models/transactions';

export async function POST({ request }) {
  let { ntag, amount, description } = await request.json()

  if (!description) {
    return json({ statusCode: 400, error: 'Description is required' }, { status: 400 })
  }

  if (!ntag) {
    return json({ statusCode: 400, error: 'Ntag is required' }, { status: 400 })
  }

  if (!amount) {
    return json({ statusCode: 400, error: 'Amount is required' }, { status: 400 })
  }

  amount = parseFloat(amount).toFixed(2);

  // CHECK KEY
  const key = request.headers.get('Authorization')
  if (!checkKey(key)) {
    return json({ statusCode: 401, error: 'Unauthorized' }, { status: 401 })
  }

  // CHECK ACCOUNT
  let account = await getAccount(ntag)
  if (!account) {
    return json({
      statusCode: 404,
      error: 'Account not found',
    }, { status: 404 })
  }

  if (!account.enabled) {
    return json({
      statusCode: 400,
      error: 'We detected an issue with your account, please contact the support',
    }, { status: 400 })
  }

  // CHECK BALANCE
  if (account.balance < amount) {
    return json({
      statusCode: 400,
      error: 'Insufficient balance',
    }, { status: 400 })
  }

  // CHECK AMOUNT
  if (!checkIsPositiveFloat(amount)) {
    return json({
      statusCode: 400,
      error: 'Invalid amount',
    }, { status: 400 })
  }

  // UPDATE BALANCE
  const new_amount = parseFloat((account.balance - amount)).toFixed(2);

  await updateAccount(ntag, new_amount)

  // CREATE TRANSACTION
  await createTransaction(account.id, -amount, description)

  // GET ACCOUNT
  account = await getAccount(ntag)

  // RETURN FINAL VALUES
  return json({
    statusCode: 200,
    data: account,
  }, { status: 200 })
}
