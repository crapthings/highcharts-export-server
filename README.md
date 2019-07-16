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
    }
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
