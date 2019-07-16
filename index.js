const fs = require('fs')
const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const puppeteer = require('puppeteer')

const exportFunc = require('./export')

const {
  PORT = 3000,
  LIMIT = 1,
  WIDTH = 1920,
  HEIGHT = 1080
} = process.env

const exportpath = path.resolve(__dirname, 'public')

if (!fs.existsSync(exportpath)) fs.mkdirSync('public')

const server = express()

server.use(cors())
server.use(bodyParser.urlencoded({ extended: true, limit: `${LIMIT}mb` }))
server.use(bodyParser.json({ limit: `${LIMIT}mb` }))
server.use('/headless', express.static('headless'))
server.use('/', express.static('public'))

const boot = async function() {
  const browser = await puppeteer.launch({
    // headless: false,
    // devtools: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    defaultViewport: {
      width: WIDTH,
      height: HEIGHT,
    },
  })

  const browserWSEndpoint = browser.wsEndpoint()

  server.post('/api/export', exportFunc({
    PORT,
    puppeteer,
    browserWSEndpoint,
  }))

  server.get('/api/status', function (req, res) {
    res.sendStatus(200)
  })

  server.listen(PORT, function () {
    console.log('Server is listening', PORT)
  })
}

boot()
