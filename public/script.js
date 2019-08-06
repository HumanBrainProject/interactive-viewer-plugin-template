/**
 * use IIFE in order to avoid poisoning the global scope
 * use const/let. Avoid using var
 */
(() => {
  console.log(`it works`)


  /**
   * pluginControl references plugin name. Good idea to defined it
   */
  const PLUGINNAME = `fzj.xg.iv-plugin-template`
  const SUBSCRIPTIONS = []
  SUBSCRIPTIONS.push(
    interactiveViewer.metadata.datasetsBSubject.subscribe(ds => {
      /**
       * look into the datasets that had been loaded
       */
    })
  )

  /**
   * always unsubscribe on shutdown to avoid memory leakage
   */
  interactiveViewer.pluginControl[PLUGINNAME].onShutdown(() => {
    while(SUBSCRIPTIONS.length > 0){
      SUBSCRIPTIONS.pop().unsubscribe()
    }
  })


  setTimeout(() => {
    interactiveViewer.pluginControl[PLUGINNAME].setProgressIndicator(0.05)
  }, 100)

  setTimeout(() => {
    interactiveViewer.pluginControl[PLUGINNAME].setProgressIndicator(0.5)
  }, 5000)

  setTimeout(() => {
    interactiveViewer.pluginControl[PLUGINNAME].setProgressIndicator(null)
    interactiveViewer.pluginControl[PLUGINNAME].blink()
  }, 9000)
})()