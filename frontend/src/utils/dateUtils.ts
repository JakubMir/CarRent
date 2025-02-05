function parseDate(dateStr: string){
    const [month, day, year] = dateStr.split("/").map(Number)
    return new Date(year, month - 1, day)
}

function formatDate(date: Date){
    const month = (date.getMonth() + 1).toString().padStart(2, "0")
    const day = date.getDate().toString().padStart(2, "0")
    const year = date.getFullYear()
    return `${month}/${day}/${year}`
}

function getTomorrowDate(){
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow
}

function sortDateRanges(ranges: Array<{startDate: Date, endDate: Date}>){
    return ranges.sort((a, b) => a.startDate.getTime() - b.endDate.getTime())
}

function getFormattedISO(date: Date){
    return date.toISOString().substring(0, 10)
}

export {
    parseDate,
    formatDate,
    getTomorrowDate,
    sortDateRanges,
    getFormattedISO
}
