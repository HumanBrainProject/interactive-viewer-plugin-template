const express = require('express')
const path = require('path')
const app = express()
const request = require('request')

app.use((_req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:8080')
  next()
})

app.use(express.static(path.join(__dirname, 'public')))

/**
 * temporary solution
 * solr instance does not come with cors header. need to proxy pass response
 */
const solrRoot = `http://imedv02.ime.kfa-juelich.de:8983/solr/inm_metadata_test/select`
app.get('/proxyGetSolr', (req, res) => {
  const {originalUrl} = req
  const url = originalUrl.replace('/proxyGetSolr', solrRoot)
  request(url).pipe(res)
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`))
