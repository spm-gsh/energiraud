import { db } from '$lib/database';

/**
 * Créer un emplacement
 * @param {string} name - Le nom de l'emplacement
 * @returns {object} - L'emplacement créé
 */
async function createLocation(name) {
  if (!name) {
    throw new Error('Name is required');
  }

  const location = await db.location.create({
    data: {
      name
    }
  });
  return location;
}

/**
 * Obtenir un emplacement par ID
 * @param {string} id - L'ID de l'emplacement
 * @returns {object} - L'emplacement
 */
async function getLocationById(id) {
  if (!id) {
    throw new Error('ID is required');
  }

  const location = await db.location.findUnique({
    where: { id }
  });
  return location;
}

/**
 * Obtenir les emplacements paginés
 * @param {number} page - Le numéro de page
 * @param {number} take - Nombre d'éléments par page
 * @returns {object[]} - Tableau d'emplacements
 */
async function getLocationPaginated(page, take) {
  if (!page || !take) {
    throw new Error('Page and take are required');
  }

  const locations = await db.location.findMany({
    skip: (page - 1) * take,
    take
  });
  return locations;
}

/**
 * Obtenir tous les emplacements
 * @returns {object[]} - Tableau de tous les emplacements
 */
async function getAllLocations() {
  const all_locations = await db.location.findMany();
  return all_locations;
}

/**
 * Mettre à jour un emplacement
 * @param {string} id - L'ID de l'emplacement
 * @param {string} name - Le nouveau nom de l'emplacement
 * @returns {object} - L'emplacement mis à jour
 */
async function updateLocation(id, name) {
  if (!id || !name) {
    throw new Error('ID and name are required');
  }

  const updated_location = await db.location.update({
    where: { id },
    data: { name }
  });
  return updated_location;
}

/**
 * Supprimer un emplacement
 * @param {string} id - L'ID de l'emplacement à supprimer
 * @returns {object} - L'emplacement supprimé
 */
async function deleteLocation(id) {
  if (!id) {
    throw new Error('ID is required');
  }

  const deleted_location = await db.location.delete({
    where: { id }
  });
  return deleted_location;
}

export {
  createLocation,
  getLocationById,
  getLocationPaginated,
  getAllLocations,
  updateLocation,
  deleteLocation
}
