const chart = new Chart(document.getElementById("bar-chart"), {
    type: 'bar',
    data: {
      labels: ["바꾸고 이긴 경우", "바꿨는데 진 경우", "유지했는데 이긴 경우", "유지했는데 진 경우"],
      datasets: [
        {
          backgroundColor: ["#44a1f8", "#ff6384","#5ed3ac","#f0bd47"],
          data: [0,0,0,0]
        }
      ]
    },
    options: {
        legend: { 
            display: false 
        },
        title: {
            display: true,
            text: '몬티홀 문제',
            fontSize: 30
        },
        scales: {
            xAxes: [{
                ticks: {
                    fontSize: 20
                }
            }],
            yAxes: [{
                ticks: {
                    fontSize: 20
                }
            }]            
        },
        animation: {
            onProgress () {
              var chartInstance = this.chart;
              var ctx = chartInstance.ctx;
              var height = chartInstance.controller.boxes[0].bottom;
              ctx.textAlign = "center";
              Chart.helpers.each(this.data.datasets.forEach(function (dataset, i) {
                var meta = chartInstance.controller.getDatasetMeta(i);
                Chart.helpers.each(meta.data.forEach(function (bar, index) {
                  const total = dataset.data.reduce((prev, cur) => prev + cur)                    
                  ctx.fillText(`${Math.round((dataset.data[index] * 100 / Math.trunc(total / 2))*100)/100 }%`, bar._model.x, height - ((height - bar._model.y) / 2) + 300);
                }),this)
              }),this);
            }
          }                      
    },
    
});


const getRandomVal = () => {
    return Math.floor(Math.random() * (3))
}

const updateChart = (a, b, c, d) => {
    chart.data.datasets[0].data = [a, b, c, d]
    chart.update()    
}

const maxInt = 100000

let changeWinCnt = 0
let changeLoseCnt = 0
let stayWinCnt = 0
let stayLoseCnt = 0

for(let i=0; i<maxInt; i++) {
    setTimeout(() => {
        const answer = getRandomVal()
        const pick = getRandomVal()
    
        let close = getRandomVal()
        while(close === answer || close === pick) {
            close = getRandomVal()
        }
    
        if(pick === answer) stayWinCnt++
        else stayLoseCnt++
    
        let change = getRandomVal()
        while(close === change || pick === change) {
            change = getRandomVal()
        }
    
        if(answer === change) changeWinCnt++
        else changeLoseCnt++

        // console.log('changeWinCnt, changeLoseCnt, stayWinCnt, stayLoseCnt', changeWinCnt, changeLoseCnt, stayWinCnt, stayLoseCnt)
        updateChart(changeWinCnt, changeLoseCnt, stayWinCnt, stayLoseCnt)
    }, i * 1)
}
