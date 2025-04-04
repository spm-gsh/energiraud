/**
 * @swagger
 * /api/accounts/{id}:
 *   get:
 *     tags:
 *       - Comptes
 *     summary: Récupère un compte par son ID
 *     description: Retourne les détails d'un compte utilisateur spécifique
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du compte à récupérer
 *     responses:
 *       200:
 *         description: Le compte a été récupéré avec succès
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
 *                     transactions:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           amount:
 *                             type: number
 *                           createdAt:
 *                             type: date-time
 *                           updatedAt:
 *                             type: date-time
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
import { checkKey, checkIsPositiveInt } from '$lib/utils';
import { getAccountByContainingName } from '$lib/models/account';

export async function GET({ request, url }) {
  const name = url.searchParams.get('name')

  // CHECK KEY
  const key = request.headers.get('Authorization')
  if (!checkKey(key)) {
    return Response.json({ statusCode: 401, error: 'Unauthorized' }, { status: 401 })
  }

  // GET ALL TRANSACTIONS
  let account = await getAccountByContainingName(name)

  if (!account) {
    return Response.json({ statusCode: 404, error: 'Account not found' }, { status: 404 })
  }

  // RETURN FINAL VALUES
  return Response.json({
    statusCode: 200,
    data: account,
  }, { status: 200 })
}