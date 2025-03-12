/**
 * @swagger
 * /api/machine/{location}:
 *   get:
 *     tags:
 *       - Machines
 *     summary: Récupère les machines pour une localisation donnée
 *     description: Retourne les informations des machines pour une localisation donnée
 *     parameters:
 *       - in: path
 *         name: location
 *         required: true
 *         schema:
 *           type: string
 *         description: Localisation des machines à récupérer
 *     responses:
 *       200:
 *         description: Les machines ont été récupérées avec succès
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
 *                     serial_number:
 *                       type: string
 *                     hourly_price:
 *                       type: number
 *                     switch_ip:
 *                       type: string
 *                     switch_port:
 *                       type: integer
 *                     location:
 *                       type: string
 *                     enabled:
 *                       type: boolean
 *                     status:
 *                       type: string
 *                     available_at:
 *                       type: string
 *                       format: date-time
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                     updated_at:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Localisation manquante
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
 *                   example: Invalid location
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
import { getWashingMachineFromLocation } from '$lib/models/washingmachine';

export async function GET({ request, params }) {
  const location = params.location

  // CHECK KEY
  const key = request.headers.get('Authorization')
  if (!checkKey(key)) {
    return json({ statusCode: 401, error: 'Unauthorized' }, { status: 401 })
  }

  // CHECK LOCATION
  if (!location) {
    return json({ statusCode: 400, error: 'Invalid location' }, { status: 400 })
  }

  // GET MACHINE FROM LOCATION
  const machines = await getWashingMachineFromLocation(location)

  // RETURN FINAL VALUES
  return json({
    statusCode: 200,
    data: machines,
  }, { status: 200 })
}
