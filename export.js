const fs = require('fs')
const path = require('path')
const generate = require('nanoid/generate')
const set = require('lodash.set')

module.exports = ({
  PORT,
  puppeteer,
  browserWSEndpoint,
}) => async function (req, res) {
  const { options } = req.body
  set(options, 'exporting.fallbackToExportServer', false)

  const rid = generate('1234567890abcdef', 10)

  const browser = await puppeteer.connect({ browserWSEndpoint })
  const page = await browser.newPage()

  await page.goto(`http://localhost:${PORT}/headless/index.html`, {
    waitUntil: 'domcontentloaded',
  })

  await page._client.send('Page.setDownloadBehavior', {
    behavior: 'allow',
    downloadPath: path.resolve(__dirname, 'public'),
  })

  try {
    await page.evaluate(async ({ options, rid }) => {
      const chart = Highcharts.chart('container', options)
      chart.exportChartLocal({
        filename: rid,
      })
    }, {
      options,
      rid,
    })

    const downloadUrl = await new Promise(async resolve => {
      const filename = rid + '.png'
      const filepath = path.resolve(__dirname, 'public', filename)
      const timerId = setInterval(async function () {
        if (!fs.existsSync(filepath)) return
        await page.close()
        await browser.disconnect()
        clearInterval(timerId)
        resolve('/' + filename)
      }, 10)
    })

    const result = {
      downloadUrl,
    }

    console.log('done', result)

    res.json({ result })
  } catch(ex) {
    console.log('failed', ex)

    await page.close()
    await browser.disconnect()

    const err = {
      message: 'failed to export'
    }

    res.json({ err })
  }
}
