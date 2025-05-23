const express = require('express')
const axios = require('axios')
const app = express()

app.get('/', async (req, res) => {
  const { q } = req.query
  if (!q) return res.status(400).json({ error: 'Missing q parameter' })
  try {
    const response = await axios.get(`https://flex-chat-api.vercel.app?q=${encodeURIComponent(q)}`)
    res.json(response.data)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch data' })
  }
})

module.exports = app
