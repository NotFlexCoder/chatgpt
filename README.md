## 🤖 ChatGpt API

This 3 party ChatGpt API acts as a proxy to OpenAI-compatible chat completions via the OI VSCode Server. It provides a simple GET-based interface to generate responses using the gpt-4o-mini-2024-07-18 model.

## 🚀 Features

- ⚡ Fast and easy chat completions with axios.
- 🔀 Supports model aliases (currently gpt-4o-mini).
- ✅ Query-based interface for simplicity.
- 📡 Forwards requests to https://oi-vscode-server-2.onrender.com/v1/chat/completions.

## 📦 Requirements

- Node.js 14+
- axios npm package

## 📡 Usage

**1. Endpoint**
Send a GET request to the deployed function or local server:
`GET /api/chat?message=Hello+world&model=gpt-4o-mini&temperature=0.8`

**2. Query Parameters**
| Parameter    | Required | Default                     | Description                                       |
|--------------|----------|-----------------------------|---------------------------------------------------|
| `message`    | ✅       | —                           | The user message to send to the model.            |
| `model`      | ❌       | `gpt-4o-mini-2024-07-18`     | Optional alias-supported model name.              |
| `temperature`| ❌       | `0.7`                        | Controls randomness (0–1).                        |
| `max_tokens` | ❌       | `2000`                       | Max tokens in the response.                       |

**✅ Example Request**
`curl "http://localhost:3000/api/chat?message=Tell+me+a+joke&temperature=0.6"`

**✅ Example Response**
```JSON
{
  "status": "success",
  "content": "Why did the developer go broke? Because they used up all their cache."
}
```

**❌ Error Response**
```JSON
{
  "status": "error",
  "message": "Message query parameter is required"
}
```

## 🔍 Code Explanation

- resolveModelName() maps alias (like gpt-4o-mini) to the actual model version.
- Makes a POST request to https://oi-vscode-server-2.onrender.com/v1/chat/completions.
- Returns only the relevant message content in the response.

## ⚠️ Error Handling

- 🛑 405 Method Not Allowed: If non-GET requests are sent.
- 📭 400 Bad Request: If message is not provided.
- 💥 500 Internal Error: If the external API fails or doesn't respond.

## 📄 License

This project is licensed under the License - see the [LICENSE](https://github.com/NotFlexCoder/chatgpt/blob/main/LICENSE) file for details.
