const fs = require('fs')
const path = require('path')
const generate = require('nanoid/generate')
const set = require('lodash.set')

module.exports = ({
  PORT,
  puppeteer,
  browserWSEndpoint,
}) => async function (req, res) {
  let type

  const { options, format = 'png' } = req.body
  set(options, 'exporting.fallbackToExportServer', false)

  const rid = generate('1234567890abcdef', 10)

  if (format === 'png') {
    type = 'image/png'
  } else if (format === 'jpeg') {
    type = 'image/jpeg'
  } else if (format === 'pdf') {
    type = 'application/pdf'
  } else if (format === 'svg') {
    type = 'image/svg+xml'
  } else {
    type = 'image/png'
  }

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
    await page.evaluate(async ({ options, type, rid }) => {
      const chart = Highcharts.chart('container', options)
      chart.exportChartLocal({
        filename: rid,
        type,
      })
    }, {
      options,
      type,
      rid,
    })

    const downloadUrl = await new Promise(async resolve => {
      const filename = rid + '.' + format
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
