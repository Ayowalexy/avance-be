import moment from "moment/moment.js";

export const formarDate = (date) => {
    let f_date = moment(new Date(date)).format('ll').replace(',', '').split(' ')
    f_date = `${f_date[1]}-${f_date[0]}-${f_date[2]}`

    return f_date
}