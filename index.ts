import express from "express";
import DigestClient from "digest-fetch";
import cors from "cors";
require("dotenv").config();

const requestTimeout = 8;

const app = express();
app.use(express.json());
app.use(cors());
const PORT = process.env.PORT || 8000;

app.get("/api/camera/:ip/:user/:password", async (req, res) => {
  try {
    const client = new DigestClient(req.params.user, req.params.password, { algorithm: "MD5" });
    const ip = req.params.ip;
    const response = await client.fetch(`http://${ip}/ISAPI/System/Status`, {
      method: "GET",
      signal: AbortSignal.timeout(requestTimeout * 1000),
    });
    const data = await response.text();
    if(response.status >= 400) {
      res.status(400);
      return res.json({ message: "server is offline" });
    }
    res.send(data);
  } catch {
    res.status(400);
    res.json({ message: "server is offline" });
  }
});

app.put("/api/camera/:ip/reboot/:user/:password", async (req, res) => {
  try {
    const client = new DigestClient(req.params.user, req.params.password, { algorithm: "MD5" });
    const ip = req.params.ip;
    const response = await client.fetch(`http://${ip}/ISAPI/System/Reboot`, {
      method: "PUT",
      signal: AbortSignal.timeout(requestTimeout * 1000),
    });
    if(response.status >= 400) {
      res.status(400);
      return res.json({ message: "server is offline" });
    }
    const data = await response.text();
    res.send(data);
  } catch {
    res.status(400);
    res.json({ message: "server is offline" });
  }
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
