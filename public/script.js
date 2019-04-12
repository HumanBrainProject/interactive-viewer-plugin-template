(() => {
  const PLUGIN_NAME = `fzj.xg.connectivity-frontend`
  const DOM_PARSER = new DOMParser()
  const URL_BASE = 'https://conn-frontend-connectivity-matrix.apps-dev.hbp.eu'
  //const URL_BASE = 'http://medpc055.ime.kfa-juelich.de:8003'

  class ConnectivityVisualizerSearchComponent extends HTMLElement {
    constructor() {
      super()
      this.template =
        `
                <div class = "row">                                       
                    <div class = "col-md-12"> 
                    <div class="input-group">
                    <p>Choose an atlas:</p>
                    <form action="" id="atlasForm">
                        <input type="radio" name="atlastype" value="Aal">Aal<br>
                        <input type="radio" name="atlastype" value="Constellation">Constellation<br>
                        <input type="radio" name="atlastype" value="Freesurfer">Freesurfer
                    </form>
                    </div>      
                    </div>                              
                    <div class = "col-md-12"> 
                    <p>Double click as many areas as you like on the atlas:</p>                    
                        <div class="row">
                            <div class = "col-md-12" areaNames>
                            </div>
                        </div>
                    </div>                           
                </div>
                    `
      this.mouseOverNehuba = this.mouseEventSubscription = this.rootChild = this.areasClicked = this.elArea = this.connectivityDict = this.atlastype = null
      this.firstrender = true
      this.radioFlag = false
      this.mouseOverRegion = null
      this.singleClickedRegion = []
    }

    connectedCallback() {
      if (this.firstrender) {
        this.init()
        this.firstrender = false
        window.interactiveViewer.metadata.selectedRegionsBSubject.subscribe(r => this.selectedRegions = r)
      }
    }

    init() {
      this.rootChild = document.createElement('div')
      this.selectedRegions = []
      this.rootChild.innerHTML = this.template
      this.appendChild(this.rootChild)
      this.atlasForm = document.getElementById('atlasForm')
      this.atlasForm.addEventListener('click', () => this.getAtlas())
      this.atlasForm.style.marginBottom = '20px'
      this.onViewerClick()
      this.initAttachMouseovernehuba()
      setTimeout(() => {

        window.interactiveViewer.pluginControl[PLUGIN_NAME].onShutdown(() => {
          this.mouseEventSubscription.unsubscribe()
          this.mouseOverNehuba.unsubscribe()
        })
      })
    }
    getAtlas() {
      this.atlastype = this.atlasForm.elements['atlastype'].value
      //TODO: FIND A BETTER WAY TO KNOW IF A RADIO BUTTON IS CHECKED
      var whichButton = document.forms[0]
      this.radioFlag = false
      for (var i = 0; i < whichButton.length; i++) {
        if (whichButton[i].checked) {
          this.radioFlag = true
          break
        }
      }
      if (this.radioFlag) {
        const headers = new Headers()
        headers.append('Content-Type', 'application/json')
        const request = new Request(`${URL_BASE}/return_matrix`, {
          method: 'POST',
          headers: headers,
          mode: 'cors',
          body: JSON.stringify(this.atlastype)
        })
        fetch(request)
          .then(resp => {
            if (resp.ok) {
              return Promise.resolve(resp)
            } else {
              return new Promise((resolve, reject) => {
                resp.text()
                  .then(text => reject(text))
              })
            }
          })
          .then(resp => resp.text())
          .then(text => {
            this.connectivityDict = JSON.parse(text)
          })
          .catch(e => {
            this.atlasForm.innerHTML += "" + e + ""
            console.log('error', e)
          })
      } 
      else {
        console.log('No atlas has been selected, cannot proceed')
      }
    }
    onViewerClick() {
      this.mouseEventSubscription = window.interactiveViewer.viewerHandle.mouseEvent.subscribe(ev => {
        if (ev.eventName == 'click') {
          setTimeout(() => {
            this.printAreas()
          })
        }
      })

    }

    visualizeConnectivity(labelIndex, regionName) {
      for (let i = 0; i < this.selectedRegions.length; i++) {
        if (this.selectedRegions[i].labelIndex != labelIndex) {
          const colourMap = new Map()
          if (this.connectivityDict[regionName] == null) {
            console.log(" " + regionName + " does not exist in the matrix")
          } else {
            let connectivityVal = this.connectivityDict[regionName][this.selectedRegions[i].name]
            console.log(regionName+' '+this.selectedRegions[i].name+' '+connectivityVal)
            let newColor = connectivityVal * 255
            colourMap.set(this.selectedRegions[i].labelIndex, {
              red: 0,
              green: 0,
              blue: newColor
            })
          }
        } else if (this.selectedRegions[i].labelIndex == labelIndex) {
          colourMap.set(this.selectedRegions[i].labelIndex, {
            red: 255,
            green: 0,
            blue: 0
          })
        }
      }
      window.interactiveViewer.viewerHandle.applyColourMap(colourMap)
    }

    printAreas() {
      const joinedAreaNames = this.selectedRegions.map(r => r.name).join('<br>')
      this.querySelector('div[areaNames]').innerHTML = "Selected areas are : <br>" + joinedAreaNames
    }

    initAttachMouseovernehuba() {

      this.mouseOverNehuba = window.interactiveViewer.viewerHandle.mouseOverNehuba
        .subscribe(ev => {
          this.mouseOverRegion = ev
          if (this.radioFlag && ev.name && ev.labelIndex) {
            this.visualizeConnectivity(ev.labelIndex, ev.name)
          }
        })
    }
  }

  const searchCard = document.querySelector('fzj-xg-connectivityvisualizer-search-card')
  const container = document.getElementById('fzj.xg.connectivityvisualizer.container')

  customElements.define('fzj-xg-connectivityvisualizer-search-card', ConnectivityVisualizerSearchComponent)
})()