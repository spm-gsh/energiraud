import { PRIVATE_API_URL, PRIVATE_KEY, PRIVATE_LOCATION } from '$env/static/private';

async function fetchAccountInfo(rfid_id) {
  try {
    const build_url = `${PRIVATE_API_URL}/api/accounts/${rfid_id}`;
    const response = await fetch(build_url, {
      headers: {
        "Authorization": `${PRIVATE_KEY}`
      }
    });
    if (response.ok) {
      const data = await response.json();
      return data.data || null; // Renvoie uniquement le bon champ (data)
    } else {
      console.error('Account Info Error:', response.status, rfid_id, await response.text()); // Log the error details
      return false;
    }
  } catch (error) {
    console.error('Fetch Account Info Error:', error);
    return false;
  }
}

async function fetchMachines() {
  try {
    const build_url = `${PRIVATE_API_URL}/api/machine/${PRIVATE_LOCATION}`;
    const response = await fetch(build_url, {
      headers: {
        "Authorization": `${PRIVATE_KEY}`
      }
    });
    if (response.ok) {
      const data = await response.json();
      return data.data || null; // Renvoie uniquement le bon champ (data)
    } else {
      console.error('Machines Error:', response.status, await response.text()); // Log the error details
      return false;
    }
  } catch (error) {
    console.error('Fetch Machines Error:', error);
    return false;
  }
}

/**
 * Launch the machine
 * @param {string} ntag - The ntag of the account
 * @param {string} machine_id - The id of the machine
 * @returns {object} - The response from the server
 */
async function launchMachine(ntag, machine_id) {
  try {
    const build_url = `${PRIVATE_API_URL}/api/machine/launch`;
    const response = await fetch(build_url, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "Authorization": `${PRIVATE_KEY}`
      },
      body: JSON.stringify({
        ntag: ntag,
        machine_id: machine_id
      })
    });
    const data = await response.json();
    return data;
  } catch (error) {
    return false;
  }
}

/**
 * Recharge the account
 * @param {string} ntag - The ntag of the account
 * @param {number} amount - The amount to recharge
 * @returns {object} - The response from the server
 */
async function rechargeAccount(ntag, amount) {
  try {
    const build_url = `${PRIVATE_API_URL}/api/refil`;
    const response = await fetch(build_url, {
      method: 'POST',
      headers: {
        "Authorization": `${PRIVATE_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        ntag: ntag,
        amount: amount,
        description: "Recharge à la borne: " + PRIVATE_LOCATION,
      })
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Recharge Account Error:', error);
    return false;
  }
}

/**
 * Toggle the machine enabled state
 * @param {string} machine_id - The id of the machine
 * @param {string} user_id - The id of the user
 * @returns {object} - The response from the server
 */
async function toggleMachine(machine_id, user_id) {
  try {
    console.log(machine_id, user_id);
    const build_url = `${PRIVATE_API_URL}/api/machine/toggle/enabled`;
    const response = await fetch(build_url, {
      method: 'POST',
      headers: {
        "Authorization": `${PRIVATE_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ machine_id: machine_id, user_id: user_id })
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Toggle Machine Error:', error);
    return false;
  }
}

async function getMachineHistory(machine_id) {
  try {
    const build_url = `${PRIVATE_API_URL}/api/machine/history/${machine_id}`;
    const response = await fetch(build_url, {
      headers: {
        "Authorization": `${PRIVATE_KEY}`
      }
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Get Machine Error:', error);
    return false;
  }
}

async function createCashCollection(ntag) {
  try {
    const build_url = `${PRIVATE_API_URL}/api/cashcollection`;
    const response = await fetch(build_url, {
      method: 'POST',
      headers: {
        "Authorization": `${PRIVATE_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ location:PRIVATE_LOCATION, ntag: ntag })
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Create Cash Collection Error:', error);
    return false;
  }
}

async function getCurrentCashCollectionAmount() {
  try {
    const build_url = `${PRIVATE_API_URL}/api/cashcollection/current_amount/${PRIVATE_LOCATION}`;
    const response = await fetch(build_url, {
      headers: {
        "Authorization": `${PRIVATE_KEY}`
      }
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Get Current Cash Collection Amount Error:', error);
    return false;
  }
}

export { 
  fetchAccountInfo,
  fetchMachines,
  launchMachine,
  rechargeAccount,
  toggleMachine,
  getMachineHistory,
  createCashCollection,
  getCurrentCashCollectionAmount
};