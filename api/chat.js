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

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ status: 'error', message: 'Method not allowed' });
  }

  try {
    const { message, max_tokens = 2000, temperature = 0.7, model } = req.query;

    if (!message) {
      return res.status(400).json({ status: 'error', message: 'Message query parameter is required' });
    }

    const resolvedModel = resolveModelName(model || OIVSCode.model);

    const response = await axios.post(
      `${OIVSCode.apiBase}/chat/completions`,
      {
        model: resolvedModel,
        messages: [{ role: 'user', content: message }],
        stream: false,
        max_tokens,
        temperature
      },
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );

    const content = response.data.choices?.[0]?.message?.content || '';

    res.json({ status: 'success', content });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.response?.data || error.message });
  }
}
