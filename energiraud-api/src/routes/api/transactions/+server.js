
/**
 * @swagger
 * /api/transactions:
 *   get:
 *     tags:
 *       - Transactions
 *     summary: Récupère les transactions paginées
 *     description: Retourne une liste paginée des transactions
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Numéro de la page à récupérer
 *       - in: query
 *         name: take
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 10
 *         description: Nombre d'éléments par page (maximum 50)
 *     responses:
 *       200:
 *         description: Les transactions ont été récupérées avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       accountId:
 *                         type: string
 *                       amount:
 *                         type: number
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                       updated_at:
 *                         type: string
 *                         format: date-time
 *       400:
 *         description: Paramètres de pagination invalides
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
 *                   example: Invalid page or take
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
 *       500:
 *         description: Erreur interne du serveur
 */
import { json } from '@sveltejs/kit';
import { checkKey } from '$lib/utils';
import { getTransactionPaginated } from '$lib/models/transactions';
import { checkIsPositiveInt } from '$lib/utils';

export async function GET({ request, url }) {
  let page = url.searchParams.get('page') || 1
  let take = url.searchParams.get('take') || 10

  // CHECK KEY
  const key = request.headers.get('Authorization')
  if (!checkKey(key)) {
    return json({ statusCode: 401, error: 'Unauthorized' }, { status: 401 })
  }

  // CHECK PAGE
  if (!checkIsPositiveInt(page)) {
    return json({ statusCode: 400, error: 'Invalid page' }, { status: 400 })
  }

  page = parseInt(page)

  // CHECK TAKE
  if (!checkIsPositiveInt(take)) {
    return json({ statusCode: 400, error: 'Invalid take' }, { status: 400 })
  }

  take = parseInt(take)

  // Maximum take is 50
  if (take > 50) {
    return json({ statusCode: 400, error: 'Take must be max 50' }, { status: 400 })
  }

  // GET ALL TRANSACTIONS
  const transactions = await getTransactionPaginated(page, take)

  // RETURN FINAL VALUES
  return json({
    statusCode: 200,
    data: transactions,
  }, { status: 200 })
}
