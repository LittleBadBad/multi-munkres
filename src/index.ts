const munkres = require('munkres-js');

function filterIndex(arr: any[], callback: (v?, i?, arr?) => any) {
    const indexes = []
    arr.forEach((v, i, arr) => {
        if (callback(v, i, arr)) {
            indexes.push(i)
        }
    })
    return indexes
}

export function calCost(totalSlot: number[][], eachPerson: number[][]) {
    let cost = 0
    totalSlot.forEach((v, i) => {
        v.forEach((v1) => {
            cost += eachPerson[v1][i]
        })
    })
    return cost
}

function shuffleUseIndexes(array: any[], indexes: number[]) {
    return indexes.map(v => array[v])
}

function shuffle(array: any[]) {
    const indexes = new Array(array.length).fill("").map((v, i) => i)
    indexes.sort(() => Math.random() - 0.5);
    return [shuffleUseIndexes(array, indexes), indexes]
}


function reduction(array: any[], indexes: number[]) {
    return array.map((v, i) => array[indexes.indexOf(i)])
}

export function multiMunkres(perSlot = [1, 1, 2, 1, 1],
                             eachPerson = [
                                 [0, 1, 0, 2, 3],
                                 [0, 1, 2, 0, 2],
                                 [2, 1, 0, 1, 3]],
                             personMax = [2, 2, 3], max = 3) {
    const restSlot = [...perSlot]
    const each = [...eachPerson.map(v => v.map(v1 => v1))]

    const totalSlot = new Array(perSlot.length).fill("").map(v => [])
    const totalP = new Array(eachPerson.length).fill("").map(v => [])

    while (restSlot.find(v => v > 0)) {
        const before = restSlot.map(v => v)
        const [restSlotT, indexes] = shuffle(restSlot)
        for (let i = 0; i < eachPerson.length; i++) {
            each[i] = shuffleUseIndexes(eachPerson[i], indexes)
        }

        const undoneSlotI = filterIndex(restSlotT, v => v > 0)
        const undonePI = filterIndex(personMax, (v, i) => totalP[i].length < personMax[i])

        if (undonePI.length) {
            const undoneP = undonePI
                .map(v => each[v])
                .map(v => undoneSlotI.map(v1 => v[v1]))
            const res_raw: number[][] = munkres(undoneP)

            undoneSlotI.forEach((v, i) => {
                const slot = res_raw.find(v => v[1] === i)
                if (slot) {
                    const [upi, usi] = slot
                    const pi = undonePI[upi]
                    const si = indexes[undoneSlotI[usi]]
                    if (totalSlot[si].indexOf(pi) === -1 && each[pi][undoneSlotI[usi]] < max) {
                        totalSlot[si].push(pi)
                        totalP[pi].push(si)
                        restSlot[si] -= 1
                    }
                }
            })

            if (restSlot.every((v, i) => v === before[i])) {
                break;
            }
        } else {
            break;
        }
    }

    return totalSlot
}

export function multiMunkres1(perSlot = [1, 1, 2, 1, 1],
                              eachPerson = [
                                  [0, 1, 0, 2, 3],
                                  [0, 1, 2, 0, 3],
                                  [2, 1, 0, 1, 3]],
                              personMax = [2, 2, 3], max = 2) {

    let restSlot = [].concat(perSlot)
    let totalSlot = new Array(perSlot.length).fill("").map(v => [])

    const totalP = new Array(eachPerson.length).fill("").map(v => [])

    let [eachPerson1, pIndexes] = shuffle(eachPerson)
    let personMax1 = shuffleUseIndexes(personMax, pIndexes)

    while (restSlot.find(v => v > 0)) {
        // const slotIndexes = new Array(perSlot.length).fill("").map((v, i) => i)
        // shuffle(slotIndexes)
        // restSlot = slotIndexes.map(v => restSlot[v])
        const before = restSlot.map(v => v)
        const [restSlotT, slotIndexes] = shuffle(restSlot)
        eachPerson1.forEach((v, i) => {
            eachPerson1[i] = shuffleUseIndexes(v, slotIndexes)
        })

        const indexes = filterIndex(restSlotT, (v) => v > 0)
        const currentPIndex = filterIndex(eachPerson1, (v, i) => !totalP[i] || totalP[i].length < personMax1[i])
        if (currentPIndex.length) {
            let currentP = currentPIndex
                .map(v => eachPerson1[v])//抽出剩余person
                .map(v => indexes.map(v1 => v[v1]))//抽出对应班次
            const res: number[][] = munkres(currentP)//optimizeRes(,perSlot.length)

            indexes.forEach((v, i) => {
                v = slotIndexes[v]
                const slot = res.find(v1 => v1[1] === i)
                if (slot) {
                    const [p, s] = slot
                    const pi = currentPIndex[p]
                    if (totalSlot[v].indexOf(pi) === -1 && totalP[pi].length < max) {
                        totalSlot[v].push(pi)
                        totalP[pi].push(v)
                        restSlotT[v] -= 1
                    }
                }
            })

            restSlot = reduction(restSlotT, slotIndexes)
            eachPerson1.forEach((v, i) => {
                eachPerson1[i] = reduction(v, slotIndexes)
            })
            if (restSlot.every((v, i) => v === before[i])) {
                break;
            }
        } else {
            break;
        }
        const ret = new Array(totalSlot.length)
        totalSlot.forEach((v, i) => {
            ret[i] = totalSlot[slotIndexes[i]]
        })
        totalSlot = ret
    }
    return totalSlot.map(v => v.map(v1 => pIndexes[v1]))
}


const a = multiMunkres()
console.log(a, calCost(a, [
    [0, 1, 0, 2, 3],
    [0, 1, 2, 0, 3],
    [2, 1, 0, 1, 3]]))
