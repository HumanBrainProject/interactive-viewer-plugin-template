import React from 'react'

const subscriptions = []
const nehubaSub = []
let toastHandler

const handleTemplateChange = (oldTemplate, template, navPos) => {
  const url = BACKEND_URL
  const pos = Array.from(navPos).map(v => v/1e6)
  const params = new URLSearchParams()
  params.append('source_space', oldTemplate.name)
  params.append('target_space', template.name)
  params.append('x', pos[0])
  params.append('y', pos[1])
  params.append('z', pos[2])
  const queryUrl = url + '?' + params.toString()
  
  if (!toastHandler) {
    toastHandler = interactiveViewer.uiHandle.getToastHandler()
  }
  
  toastHandler.timeout = -1
  toastHandler.htmlMessage = `<div class="d-flex align-items-center p-2">
      <div class="spinnerAnimationCircle"></div>
      <div class="ml-2">Template Translate: Translating from ${oldTemplate.name}, ${pos.map(v => v + 'mm').join(', ')} to ${template.name}</div>
    </div>`
  toastHandler.show()
  fetch(queryUrl)
    .then(res => res.json())
    .then(({ target_point: targetPoint }) => {
      toastHandler.hide()
      interactiveViewer.viewerHandle.setNavigationLoc(targetPoint.map(v => v*1e6), true)
      toastHandler.htmlMessage = `Translation complete, moving viewer to ${targetPoint.map(v => v + 'mm').join(', ')}`
      toastHandler.timeout = 5000
      toastHandler.show()
    })
    .catch(e => {
      console.error(e)
      toastHandler.hide()    
      toastHandler.htmlMessage = `Translation Error`
      toastHandler.timeout = 5000
      toastHandler.show()
    })
}

export default class App extends React.Component{
  constructor(props){
    super(props)

    this.state = {
      flag: true,
      oldTemplate: null,
      navPos: null
    }
  }

  componentDidMount(){
    const iv = window && window.interactiveViewer
    const templateBS = iv && iv.metadata && iv.metadata.selectedTemplateBSubject
    if (templateBS) {
      subscriptions.push(
        templateBS.subscribe(template => {
          while(nehubaSub.length > 0)
            nehubaSub.pop().unsubscribe()
          const navState = window && window.nehubaViewer && window.nehubaViewer.navigationState
          if (template && navState)
            nehubaSub.push(
              navState.position.inRealSpace.subscribe(pos => {
                this.setState({
                  navPos: pos
                })
              })
            )
        })
      )
      subscriptions.push(
        templateBS.subscribe(template => {
          if (this.state.flag && this.state.oldTemplate && template.name !== this.state.oldTemplate.name) {
            handleTemplateChange(this.state.oldTemplate, template, this.state.navPos)
          }
          this.setState({
            oldTemplate: template
          })
        })
      )
    }
  }

  componentWillUnmount(){
    while(subscriptions.length > 0)
      subscriptions.pop().unsubscribe()
    while(nehubaSub.length > 0)
      nehubaSub.pop().unsubscribe()
  }

  toggleFlag(){
    this.setState(state => { 
      return {
        flag: !state.flag 
      }
    })
  }

  description(){
    return <span>This plugin utilises hbp-sptial-backend 
      [<a href="https://github.com/HumanBrainProject/hbp-spatial-backend">github repo</a>]
      to translate location between different spaces.
      </span>
  }

  icon(){
    return <i className={ this.state.flag ? 'fas fa-toggle-on' : 'fas fa-toggle-off' }></i>
  }

  viewerState(){
    return <div>
      <div>
        {this.state.oldTemplate ? this.state.oldTemplate.name : 'no template selected'}
      </div>
      <div>
        {this.state.navPos ? Array.from(this.state.navPos).map(v => (v / 1e6).toFixed(3)).join(', ') : '' }
      </div>
    </div>
  }

  render(){
    return <div style={{padding: '1em'}}>
      {this.description()}
      <hr />
      {this.viewerState()}
      <hr />
      <span className="btn btn-secondary" onClick={() => this.toggleFlag()}>
        {this.state.flag ? 'on' : 'off'} {this.icon()}
      </span>
    </div>
  }
}