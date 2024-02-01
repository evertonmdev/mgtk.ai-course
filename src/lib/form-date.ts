export const formatDate = (date_s: Date) => {
    const date = new Date(date_s)

    const day = date.getDate()
    const month = date.getMonth() + 1
    const year = date.getFullYear()

    return `${day}/${month}/${year}`
}