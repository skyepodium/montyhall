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
                  const val = total === 0 ? 0 : `${Math.round((dataset.data[index] * 100 / total)*100)/100 }%`           
                  ctx.fillText(val, bar._model.x, height - ((height - bar._model.y) / 2) + 300);
                }),this)
              }),this);
            }
          }                      
    },
    
});

const updateChart = (a, b, c, d) => {
    console.log(a, b, c, d)
    chart.data.datasets[0].data = [a, b, c, d]
    chart.update()    
}


class MontyHall {
    constructor(chart, updateChart) {
        this.chart = chart
        this.updateChart = updateChart
        this.init()
        this.addHandler()
        this.reset()
    }

    init() {
        this.totalCnt = 0
        this.winCnt = 0
        this.loseCnt = 0

        this.answer = -1
        this.pick = -1
        this.close = -1    
        
        this.a = 0
        this.b = 0
        this.c = 0
        this.d = 0
    }

    addHandler() {
        document.querySelector('#container').addEventListener('click', ({target}) => {
            const contents = target.closest('div')
        
            if (!contents) return
            const { id } = contents.dataset
            if (!id) return
        
            const pickId = Number(id)
        
            if(this.close === -1) {
                this.selectDoor(pickId)
            }
            else {
                if(pickId === this.close) return
                this.check(pickId)
            }
        });
    }

    reset () {
        this.answer = this.getRandomVal(3)
        this.pick = -1
        this.close = -1
    
        console.log('\n')
        console.log('정답', this.answer)
        console.log('\n')
    
        const doors = document.querySelectorAll('.door')
    
        doors.forEach(x => {
            x.classList.remove('close')
            x.classList.remove('pick')
        })        
    }

    closeDoor(close) {
        document.querySelectorAll('.door')?.[close].classList.add("close")
    }    

    selectDoor(pickId) {
        const $selectedDoor = document.querySelector(`[data-id="${pickId}"]`)
        $selectedDoor.classList.add('pick')

        this.pick = pickId
    
        const idxList = [0, 1, 2]
        const failList = idxList.filter(x => x !== this.answer && x !== this.pick)
    
        this.close = failList[this.getRandomVal(failList.length)]
        console.log('=============')
        console.log('pick', this.pick)
        console.log('answer', this.answer)
        console.log('close', this.close)
        console.log('=============')
    
        this.closeDoor(this.close)

        return this.close
    }   
    
    getRatio (a, b) {
        return Math.trunc((100 * a/b) * 100 / 100)
    }

    updateText(selector, text) {
        document.querySelector(selector).innerText = text
    }

    check (pickId) {
        this.totalCnt++
        
        if(pickId === this.answer) this.winCnt++
        else this.loseCnt++

        if(this.chart) {
            // 1. 맞춤
            if(pickId === this.answer) {
                // 1) 바꿈 
                if(this.pick !== pickId) this.a++
                // 2) 안바꿈
                else this.c++
            }
            // 2. 틀림
            else {
                // 1) 바꿈 
                if(this.pick !== pickId) this.b++
                // 2) 안바꿈
                else this.d++
            }

            this.updateChart(this.a, this.b, this.c, this.d)
        }
    
        const winRate = this.getRatio(this.winCnt, this.totalCnt)
        const loseRate = this.getRatio(this.loseCnt, this.totalCnt)
    
        console.log('totalCnt', this.totalCnt)
        console.log('winRate', winRate)
        console.log('loseRate', loseRate)
    
        this.updateText('#totalCnt', `${this.totalCnt?.toLocaleString()}`)
        this.updateText('#winRate', `${winRate}%`)
        this.updateText('#loseRate', `${loseRate}%`)

       this.reset()
    }    

    getRandomVal (range) {
        return Math.floor(Math.random() * range)
    }    
}

const montyHall = new MontyHall(chart, updateChart)
