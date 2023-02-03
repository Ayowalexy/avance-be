import dotenv from 'dotenv';
import axios from "axios";

dotenv.config();

const PERICULUM_CLIENT_ID = process.env.PERICULUM_CLIENT_ID;
const PERICULUM_CLIENT_SECRET = process.env.PERICULUM_CLIENT_SECRET;
const PERICULUM_GRANT_TYPE = process.env.PERICULUM_GRANT_TYPE;
const PERICULUM_AUDIENCE = process.env.PERICULUM_AUDIENCE;
const PERICULUM_BASE_URL = process.env.PERICULUM_BASE_URL;

const getPericulumAccessToken = async () => {
    const response = await axios(`${PERICULUM_BASE_URL}`, {
        method: 'post',
        data: {
            "client_id": PERICULUM_CLIENT_ID,
            "client_secret": PERICULUM_CLIENT_SECRET,
            "audience": PERICULUM_AUDIENCE,
            "grant_type": PERICULUM_GRANT_TYPE
        }
    })


    return response.data
}

export default getPericulumAccessToken