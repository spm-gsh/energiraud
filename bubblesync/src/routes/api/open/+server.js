import dgram from "dgram";

function sendCommand(message, plugIp, plugPort) {
    const client = dgram.createSocket("udp4");
    const buffer = Buffer.from(message);
    
    client.send(buffer, 0, buffer.length, plugPort, plugIp, (err) => {
        if (err) console.error(err);
        else console.log(`Commande envoyée : ${message}`);
        client.close(); // Fermeture après l'envoi
    });
}

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
  const { plugIp, plugPort } = await request.json();
  try {
      sendCommand("TURN_ON", plugIp, plugPort);
      console.log("Charge lancée.");

      // Attendre 2h avant d'éteindre la prise
      setTimeout(() => {
          sendCommand("TURN_OFF", plugIp, plugPort);
          console.log("Charge terminée, prise éteinte.");
      }, 2 * 60 * 60 * 1000);

      return new Response(JSON.stringify({ success: true, message: "Charge démarrée" }), { status: 200 });
  } catch (error) {
      console.error("Erreur :", error);
      return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}