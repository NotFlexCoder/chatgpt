import axios from 'axios';

const OIVSCode = {
  apiBase: "https://oi-vscode-server-2.onrender.com/v1",
  model: "gpt-4o-mini-2024-07-18",
  modelAliases: {
    "gpt-4o-mini": "gpt-4o-mini-2024-07-18"
  }
};

function resolveModelName(inputModel) {
  return OIVSCode.modelAliases[inputModel?.toLowerCase()] || OIVSCode.model;
}

async function handleStreamingResponse(messages, maxTokens, temperature, res) {
  try {
    const response = await axios({
      method: 'post',
      url: `${OIVSCode.apiBase}/chat/completions`,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'text/event-stream'
      },
      data: {
        model: OIVSCode.model,
        messages,
        stream: true,
        max_tokens: maxTokens,
        temperature
      },
      responseType: 'stream'
    });

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Model', OIVSCode.model);

    response.data.pipe(res);
  } catch (error) {
    console.error('Streaming error:', error);
    res.status(500).json({ error: 'Streaming failed' });
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages, stream = false, max_tokens = 2000, temperature = 0.7, model } = req.body;
    const resolvedModel = resolveModelName(model || OIVSCode.model);

    if (stream) {
      return handleStreamingResponse(messages, max_tokens, temperature, res);
    }

    const response = await axios.post(
      `${OIVSCode.apiBase}/chat/completions`,
      {
        model: resolvedModel,
        messages,
        stream: false,
        max_tokens,
        temperature
      },
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Request failed', details: error.response?.data || error.message });
  }
}
