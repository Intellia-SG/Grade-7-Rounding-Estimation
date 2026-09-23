export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { text, voiceId, voiceSettings } = req.body;
  const apiKey = process.env.ELEVENLABS_API_KEY || process.env.VITE_ELEVENLABS_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'Missing ElevenLabs API Key in environment.' });
  }

  try {
    const elevenResponse = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId || 'Xb7hH8MSUJpSbSDYk0k2'}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': apiKey,
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: voiceSettings || {
          stability: 0.20,
          similarity_boost: 0.55,
          style: 0.50,
          use_speaker_boost: true,
        },
      }),
    });

    if (!elevenResponse.ok) {
      const errText = await elevenResponse.text();
      return res.status(elevenResponse.status).json({ error: errText });
    }

    const audioBuffer = await elevenResponse.arrayBuffer();
    res.setHeader('Content-Type', 'audio/mpeg');
    return res.status(200).send(Buffer.from(audioBuffer));
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
