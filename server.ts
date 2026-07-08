import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Use JSON middleware for payloads
  app.use(express.json({ limit: '10mb' }));

  // API Route to proxy request to Google Sheets
  app.post("/api/sync-sheets", async (req, res) => {
    try {
       const { webappUrl, payload } = req.body;
      
       const rawTargetUrl = webappUrl || process.env.VITE_GOOGLE_SHEETS_WEBAPP_URL;
       const targetUrl = rawTargetUrl ? rawTargetUrl.trim().replace(/^['"]|['"]$/g, '') : '';
      
       if (!targetUrl) {
        console.error("[Proxy Error] No target URL defined.");
        return res.status(400).json({ status: "error", message: "Aucune URL de script Google Sheets configurée." });
      }

      console.log(`[Proxy] Envoi des données vers le script Google Sheets : ${targetUrl}`);

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
      console.log("[Proxy] Réponse brute du script Google Sheets:", responseText);

      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch (parseErr) {
        // If the response is HTML, it is a Google Apps Script error page.
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
        
        // Fallback if Apps Script returns non-JSON or success plain text
        responseData = { status: "success", rawResponse: responseText };
      }

      return res.json(responseData);
    } catch (error: any) {
      console.error("[Proxy] Échec critique lors de l'appel Google Sheets:", error);
      return res.status(500).json({
        status: "error",
        message: error.message || "Erreur interne de proxy"
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("[Server] Vite middleware mounted for development mode.");
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    // In Express v4, we use '*'
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log("[Server] Static dist/ path mounted for production mode.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
