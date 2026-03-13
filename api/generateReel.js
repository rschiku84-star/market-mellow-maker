export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { prompt } = req.body;

    const response = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
      },
      body: JSON.stringify({
        version:
          "db21e45a3f7c0f3c7a4bfc4e6f1b7c9d1e7f3f6e8f2b1c3a4d5e6f7g8h9i0j1",
        input: {
          prompt: prompt,
        },
      }),
    });

    const data = await response.json();

    res.status(200).json({
      id: data.id,
      status: data.status,
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
