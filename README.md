## Highcharts Export Server

### How to Use

```bash
git clone --depth 1 https://github.com/crapthings/highcharts-export-server
cd highcharts-export-server
npm i
npm start
```

```js
const data = await axios.post('http://localhost:3000/export', {
  {
    format: 'png', // can be png, jpeg, pdf, svg
    options: {
      chart: {
        type: 'bar'
      },
      title: {
        text: 'Fruit Consumption'
      },
      xAxis: {
        categories: ['Apples', 'Bananas', 'Oranges']
      },
      yAxis: {
        title: {
          text: 'Fruit eaten'
        }
      },
      series: [{
        name: 'Jane',
        data: [1, 0, 4]
      }, {
        name: 'John',
        data: [5, 7, 3]
      }]
    },
    exportOptions: {} // this can be override exportChartLocal({ ...exportOptions })
  }
})
```

```json
{
  "result": {
    "downloadUrl": "/4af6b52009.png"
  }
}
```

### format

support 'png', 'jpeg', 'pdf', 'svg'

format will be override if you specify exportOptions.type

### options

> https://www.highcharts.com/docs/getting-started/your-first-chart

> https://api.highcharts.com/highcharts

### exportOptions

> https://api.highcharts.com/highcharts/exporting

### Alternative

> https://github.com/highcharts/node-export-server
