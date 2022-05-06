class MontyHall {
    constructor() {
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

const montyHall = new MontyHall()
