import type { IncomingMessage, ServerResponse } from "http";

interface VercelRequest extends IncomingMessage {
  query: { [key: string]: string | string[] };
  cookies: { [key: string]: string };
  body: any;
}

interface VercelResponse extends ServerResponse {
  send: (body: any) => VercelResponse;
  json: (jsonBody: any) => VercelResponse;
  status: (statusCode: number) => VercelResponse;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ status: 'error', message: 'Method Not Allowed' });
  }

  try {
    const { webappUrl, payload } = req.body;
    
    const rawTargetUrl = webappUrl || process.env.VITE_GOOGLE_SHEETS_WEBAPP_URL;
    const targetUrl = rawTargetUrl ? rawTargetUrl.trim().replace(/^['"]|['"]$/g, '') : '';
    
    if (!targetUrl) {
      console.error("[Proxy Error] No target URL defined.");
      return res.status(400).json({ status: "error", message: "Aucune URL de script Google Sheets configurée." });
    }

    console.log(`[Proxy Vercel] Envoi des données vers le script Google Sheets : ${targetUrl}`);

    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error(`[Proxy Error] Google Sheets returned HTTP status ${response.status}`);
      return res.status(response.status).json({
        status: "error",
        message: `Le script Google Sheets a renvoyé un statut HTTP d'échec : ${response.status}`
      });
    }

    const responseText = await response.text();
    console.log("[Proxy Vercel] Réponse brute du script Google Sheets:", responseText);

    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch (parseErr) {
      if (responseText.includes("<!DOCTYPE html>") || responseText.includes("<html") || responseText.includes("Script function not found")) {
        let errorMsg = "Le script Google Sheets a renvoyé une erreur.";
        if (responseText.includes("Script function not found: doPost")) {
          errorMsg = "Erreur Google Apps Script : La fonction 'doPost' est introuvable. Veuillez vous assurer d'avoir enregistré le code avec la fonction 'doPost(e)' et d'avoir créé une nouvelle version de déploiement (Nouvelle version) dans l'interface Google Apps Script.";
        } else if (responseText.includes("Script function not found")) {
          errorMsg = "Erreur Google Apps Script : Une fonction requise est introuvable dans votre script.";
        } else if (responseText.includes("Authorization is required")) {
          errorMsg = "Erreur Google Apps Script : Autorisation requise. Assurez-vous d'avoir configuré l'accès sur 'Tout le monde' (Anyone).";
        }
        
        return res.status(422).json({
          status: "error",
          message: errorMsg,
          htmlError: true
        });
      }
      
      responseData = { status: "success", rawResponse: responseText };
    }

    return res.status(200).json(responseData);
  } catch (error: any) {
    console.error("[Proxy Vercel] Échec critique lors de l'appel Google Sheets:", error);
    return res.status(500).json({
      status: "error",
      message: error.message || "Erreur interne de proxy"
    });
  }
}
