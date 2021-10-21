// 根据给定的开始结束时间，转换成树形结构
const DATE_INTERVAL = (startDateStamp, endDateStamp) => {
    const diffStamp = endDateStamp - startDateStamp
    const oneDayStamp = 86400000
    let dateTree = {}
    for (let i = 0; i <= diffStamp / oneDayStamp; i++) {
        const date = startDateStamp + i * oneDayStamp
        const day = new Date(date)
        const y = day.getFullYear()
        const m = day.getMonth() + 1
        const d = day.getDate()

        dateTree[y] = dateTree[y] || {}
        dateTree[y][m] = dateTree[y][m] || {}
        dateTree[y][m][d] = null
    }

    return dateTree
}


export {
    DATE_INTERVAL
}