 export const dateConverter = date => {
    const newDate = new Date(date)
    const day = newDate.getDate()
    const time = `${newDate.getHours()}:${newDate.getMinutes() < 10 ? '0' + newDate.getMinutes() : newDate.getMinutes() }`
    let monthFull = newDate.toLocaleString('ru', {
        month: 'short'
    }).split('')
    monthFull[0] = monthFull[0].toUpperCase()
    monthFull = monthFull.join('')

    return `${monthFull}  ${day}, ${time}`
}