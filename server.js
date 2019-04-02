import React from 'react'
import { renderToString } from 'react-dom/server'
import path from 'path'
import App from './src/App'
import express from 'express'
import cors from 'cors'

import dotenv from 'dotenv'

const app = express()
app.use(cors())

if (process.env.NODE_ENV !== 'production') {
  dotenv.config()
}

const publicPath = path.resolve(__dirname, 'dist', 'public')
app.use(express.static(publicPath))

const HOSTNAME = process.env.HOSTNAME || `http://localhost`
const PORT = process.env.PORT || 3001

const manifest = {
  name: process.env.PLUGIN_NAME || 'fzj.xg.templateTranslate',
  displayName: 'Template Translate',
  templateURL: `${HOSTNAME}:${PORT}/template`,
  scriptURL: `${HOSTNAME}:${PORT}/client.js`,
  persistency: true
}

app.get('/manifest.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  res.status(200).send(JSON.stringify(manifest))
})

const appendJs = (div) => {
  return `<div id="fzj.xg.templateTranslate">${div}</script>`
}

app.get('/template', (req, res) => {
  const body = renderToString(<App />)
  res.send(appendJs(body))
})

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`))
