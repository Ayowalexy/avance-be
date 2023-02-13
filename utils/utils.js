import axios from "axios"

export const getAllBanks = async (name) => {
    let bank = {}
    try {
        const response = await axios.get('https://nigerianbanks.xyz')

        bank = response.data.find(ele => ele?.name?.toLowerCase() === name.toLowerCase())

    } catch (e) {
        console.log(e)
    }
    return bank
}

export const validateFiles = (file = { originalname: '' }) => {
    const originalName = file?.originalname;
    let errMsg = 'report is required and must be of type pdf, docx, doc or txt'

    if (originalName) {
        if (originalName.includes('pdf') || originalName.includes('docx') || originalName.includes('doc') || originalName.includes('txt')) {
            console.log('rrrunn')
            errMsg = ''
        }
    }

    return errMsg
}