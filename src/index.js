import App from './App'
import React from 'react'
import { hydrate, unmountComponentAtNode } from 'react-dom'

/**
 * needed because JS is appended first, then dom is appended
 */
setTimeout(() => {
  const container = document.getElementById('fzj.xg.templateTranslate')
  hydrate(<App />, container)
  const handler = window && window.interactiveViewer && window.interactiveViewer.pluginControl && window.interactiveViewer.pluginControl[PLUGIN_NAME]
  if (handler) {
    handler.onShutdown(() => {
      unmountComponentAtNode(container)
    })
  }
})
