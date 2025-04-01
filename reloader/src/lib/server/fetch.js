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
      return data.data || null;
    } else {
      console.error('Account Info Error:', response.status, rfid_id, await response.text());
      return false;
    }
  } catch (error) {
    console.error('Fetch Account Info Error:', error);
    return false;
  }
}

async function rechargeAccount(ntag, amount) {
  try {
    const build_url = `${PRIVATE_API_URL}/api/refill`;
    const response = await fetch(build_url, {
      method: 'POST',
      headers: {
        "Authorization": `${PRIVATE_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ 
        ntag: ntag,
        amount: amount,
        description: 'Recharge de compte à la borne ' + PRIVATE_LOCATION
      })
    });
    if (response.ok) {
      const data = await response.json();
      return {success: true, data: data.data || null};
    } else {
      console.error('Recharge Account Error:', response.status, ntag, await response.text());
      return {success: false, message: 'Erreur lors de la recharge. Veuillez réessayer plus tard.'};
    }
  } catch (error) {
    console.error('Recharge Account Error:', error);
    return {success: false, message: 'Erreur lors de la recharge. Veuillez réessayer plus tard.'};
  }
}

export { 
  fetchAccountInfo,
  rechargeAccount
};