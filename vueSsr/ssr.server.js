import { createApp, createAnalysis } from './app'

export default ({ app, analysis }) => {
  if ( app ) {
    const { app } = createApp()
    return app
  }
  if ( analysis ) {
    const { vueId } = analysis
    const { analysis:a } = createAnalysis({ vueId })
    return a
  }
  return null
}