
/**
 * @swagger
 * /api/accounts:
 *   get:
 *     tags:
 *       - Comptes
 *     summary: Récupère les comptes paginés
 *     description: Retourne une liste paginée des comptes utilisateurs
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
 *         description: Les comptes ont été récupérés avec succès
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
 *                       name:
 *                         type: string
 *                       ntag:
 *                         type: string
 *                       balance:
 *                         type: number
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                       enabled:
 *                         type: boolean
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
import { getAccountsPaginated, createAccount } from '$lib/models/account';
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

  // GET ALL ACCOUNTS
  const accounts = await getAccountsPaginated(page, take)

  // RETURN FINAL VALUES
  return json({
    statusCode: 200,
    data: accounts,
  }, { status: 200 })
}

/**
 * @swagger
 * /api/accounts:
 *   post:
 *     tags:
 *       - Comptes
 *     summary: Crée un compte
 *     description: Crée un compte utilisateur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               ntag:
 *                 type: string
 *     responses:
 *       200:
 *         description: Le compte a été créé avec succès
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
 *         description: Paramètres invalides
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
 *                   example: Invalid parameters
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
export async function POST({ request }) {
  const { name, ntag } = await request.json()

  // CHECK KEY
  const key = request.headers.get('Authorization')
  if (!checkKey(key)) {
    return json({ statusCode: 401, error: 'Unauthorized' }, { status: 401 })
  }

  // CHECK NAME
  if (name.length < 3) {
    return json({ statusCode: 400, error: 'Name must be at least 3 characters' }, { status: 400 })
  }

  // CHECK NTAG
  if (ntag.length < 3) {
    return json({ statusCode: 400, error: 'Ntag must be at least 3 characters' }, { status: 400 })
  }

  // CREATE ACCOUNT
  const account = await createAccount(name, ntag);

  // RETURN FINAL VALUES
  return json({
    statusCode: 200,
    data: account,
  }, { status: 200 })
}
