import fs from 'fs'
import { cloudinary } from "../cloudinary/cloudinary.js";
import FormData from "form-data";
import axios from 'axios';

async function uploadToCloudinary(locaFilePath) {
    var mainFolderName = "main"
    var filePathOnCloudinary = mainFolderName + "/" + locaFilePath;   

    const form = new FormData()

    form.append('upload_preset', 'parcelboy')
    form.append("file", locaFilePath)

    try {
        const res_ = await axios.post('https://api.cloudinary.com/v1_1/code-idea/upload', form, {
            headers: {
                ...form.getHeaders(),
            }
        })
        console.log(res_.data)
    } catch (e) {
        console.log(e)
    }

    // cloudinary.uploader.upload(locaFilePath, function (res, err) { console.log("res", res, 'err', err) });

    //     return cloudinary.uploader.upload(locaFilePath, { "public_id": filePathOnCloudinary })
    //         .then((result) => {
    //             fs.unlinkSync(locaFilePath)
    //             return {
    //                 message: "Success",
    //                 url: result.url
    //             };
    //         }).catch((error) => {
    //             fs.unlinkSync(locaFilePath)
    //             return { message: "Fail", };
    //         });
}

export default uploadToCloudinary