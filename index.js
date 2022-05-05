const getRandomVal = (range) => {
    return Math.floor(Math.random() * (range))
}

let totalCnt = 0
let winCnt = 0
let loseCnt = 0

let answer = -1
let pick = -1
let close = -1

const reset = () => {
    answer = getRandomVal(3)
    pick = -1
    close = -1

    console.log('\n')
    console.log('정답', answer)
    console.log('\n')

    const doors = document.querySelectorAll('.door')

    doors.forEach(x => {
        x.classList.remove('close')
        x.classList.remove('pick')
    })
}

const closeDoor = close => {
    const door = document.querySelectorAll('.door')?.[close]

    door.classList.add("close")
}

const go = pickId => {
    pick = pickId

    const idxList = [0, 1, 2]
    const failList = idxList.filter(x => x !== answer && x !== pick)

    close = failList[getRandomVal(failList.length)]
    console.log('=============')
    console.log('pick', pick)
    console.log('answer', answer)
    console.log('close', close)
    console.log('=============')

    closeDoor(close)
}

const check = (pickId) => {
    totalCnt++
    if(pickId === answer) winCnt++
    else loseCnt++

    reset()

    const winRate = Math.trunc((100 * winCnt/totalCnt) * 100 / 100)
    const loseRate = Math.trunc((100 * loseCnt/totalCnt) * 100 / 100)

    console.log('totalCnt', totalCnt)
    console.log('winRate', winRate)
    console.log('loseRate', loseRate)

   document.querySelector('#totalCnt').innerText = `${totalCnt}`
   document.querySelector('#winRate').innerText = `${winRate}%`
   document.querySelector('#loseRate').innerText = `${loseRate}%`
}


const container = document.querySelector('#container')

container.addEventListener('click', ({target}) => {
    const contents = target.closest('div')

    if (!contents) return
    const { id } = contents.dataset
    if (!id) return

    const pickId = Number(id)

    if(close === -1) {
        target.classList.add('pick')
        go(pickId)
    }
    else {
        if(pickId === close) return
        check(pickId)
    }
});

reset()