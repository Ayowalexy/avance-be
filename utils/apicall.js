import axios from "axios";
import dotenv from 'dotenv'

dotenv.config();

const ClientID = process.env.Client_ID
const ClientSecret = process.env.Client_Secret



const useAxios = async function apiRequest(request) {
    const resp = await axios.request({
        ...request,
        headers: {
            "Content-Type": 'application/json',
            "Client-ID": ClientID,
            "Client-Secret": ClientSecret
        }
    });

    return resp;
};

export default useAxios;
