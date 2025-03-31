/**
 * @swagger
 * /api/transactions/{id}:
 *   get:
 *     tags:
 *       - Transactions
 *     summary: Récupère les transactions d'un compte
 *     description: Retourne la liste des transactions d'un compte spécifique
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Identifiant du compte
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
import { getTransactionById } from '$lib/models/transactions';

export async function GET({ request, params }) {
  const id = params.id

  // CHECK KEY
  const key = request.headers.get('Authorization')
  if (!checkKey(key)) {
    return json({ statusCode: 401, error: 'Unauthorized' }, { status: 401 })
  }

  // GET ALL TRANSACTIONS
  const transactions = await getTransactionById(id)

  // RETURN FINAL VALUES
  return json({
    statusCode: 200,
    data: transactions,
  }, { status: 200 })
}
