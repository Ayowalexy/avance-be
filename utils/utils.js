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