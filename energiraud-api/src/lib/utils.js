import { PRIVATE_KEY } from '$env/static/private'

/**
 * Check if the string is a float
 * @param {string} value 
 * @returns {boolean}
 */
function checkIsFloat(value) {
  return !isNaN(value) && !isNaN(parseFloat(value));
}

/**
 * Check if the string is a positive float
 * @param {string} value 
 * @returns {boolean}
 */
function checkIsPositiveFloat(value) {
  return checkIsFloat(value) && parseFloat(value) > 0;
}

/**
 * Check if the string is a negative float
 * @param {string} value 
 * @returns {boolean}
 */
function checkIsNegativeFloat(value) {
  return checkIsFloat(value) && parseFloat(value) < 0;
}

/**
 * Check if the string is a positive int
 * @param {string} value 
 * @returns {boolean}
 */ 
function checkIsPositiveInt(value) {
  return checkIsInt(value) && parseInt(value) > 0;
}

/**
 * Check if the string is an int
 * @param {string} value 
 * @returns {boolean}
 */
function checkIsInt(value) {
  return !isNaN(value) && !isNaN(parseInt(value));
}


/**
 * Check if the key is valid
 * @param {object} header_data 
 * @returns {boolean} true if the key is valid, false otherwise
 */
function checkKey(key) {
  if (!key) {
    return false;
  }
  const bearer_token = key.trim();
  return bearer_token === PRIVATE_KEY;
}

/**
 * Check if the location is valid
 * @param {string} location 
 * @returns {boolean} true if the location is valid, false otherwise
 */
function checkLocation(location, account) {
  if (account.mainLocationId === location) {
    return true;
  }

  if (account.allowedLocations.some(loc => loc.name === location)) {
    return true;
  }

  return false;
}


export { checkIsFloat, checkIsPositiveFloat, checkIsNegativeFloat, checkIsPositiveInt, checkKey, checkLocation }