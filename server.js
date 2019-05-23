const express = require('express')
const path = require('path')
const app = express()
const cors = require('cors')

if (process.env.NODE_ENV !== 'production') {
  app.use(cors())
}

app.use(express.static(path.join(__dirname, 'public')))

const PORT = process.env.PORT || 3001

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`))
