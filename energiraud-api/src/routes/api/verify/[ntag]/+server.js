/**
 * @swagger
 * /api/verify/{ntag}:
 *   get:
 *     tags:
 *       - Actions
 *     summary: Vérifie le solde d'un compte
 *     description: Retourne les informations de vérification du solde d'un compte
 *     parameters:
 *       - in: path
 *         name: ntag
 *         required: true
 *         schema:
 *           type: string
 *         description: Identifiant NFC du compte
 *     responses:
 *       200:
 *         description: Les informations de vérification ont été récupérées avec succès
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
 *                     balance:
 *                       type: number
 *                     transactions:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           amount:
 *                             type: number
 *                           created_at:
 *                             type: string
 *                             format: date-time
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
 *         description: Compte non trouvé ou vérification impossible
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
import { db } from '$lib/database';
import { json } from '@sveltejs/kit';
import { checkKey } from '$lib/utils';
import { balanceVerification } from '$lib/models/account';

export async function GET({ params, request }) {  
  const ntag = params.ntag

  // CHECK KEY
  const key = request.headers.get('Authorization')
  if (!checkKey(key)) {
    return json({ statusCode: 401, error: 'Unauthorized' }, { status: 401 })
  }

  const account = await db.account.findUnique({
    where: { ntag }
  })

  if (!account) {
    return json({
      statusCode: 404,
      error: 'Account not found',
    }, { status: 404 })
  }

  try {
    const verification_data = await balanceVerification(account.id);

    if (!verification_data) {
      return json({
        statusCode: 404,
        error: 'Balance verification not found',
      }, { status: 404 })
    }

    return json({
      statusCode: 200,
      data: verification_data,
    }, { status: 200 })

  } catch (error) {
    console.error(error)
    return json({
      statusCode: 500,
      error: 'Internal server error',
    }, { status: 500 })
  }
}
