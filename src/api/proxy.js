export default async function handler(req, res) {
  const backendBase = "http://13.233.128.255:8007";

  const targetURL = backendBase + req.url.replace("/api/proxy", "");

  try {
    const response = await fetch(targetURL, {
      method: req.method,
      headers: req.headers,
      body:
        req.method !== "GET" && req.method !== "HEAD"
          ? req.body
          : undefined,
    });

    const data = await response.text();

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(response.status).send(data);
  } catch (error) {
    res.status(500).json({ error: "Proxy failed", details: error.message });
  }
}
