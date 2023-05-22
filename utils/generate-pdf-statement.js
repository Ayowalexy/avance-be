import html_to_pdf from 'html-pdf-node';
import { cloudinary } from '../cloudinary/cloudinary.js';
import streamifier from 'streamifier'
import { create_pdf } from './pdf.js';
import AnalysedStatement from '../models/analysedStatement.js';


let options = { format: 'A4' };

const generator = async (content, key) => {

    let file = { content };
    const statement = await AnalysedStatement.findOne({ key });
    if (statement) {
        const buffer = await html_to_pdf.generatePdf(file, options);

        let _buffer = new Buffer.from(buffer, 'base64');

        let cld_upload_stream = cloudinary.uploader.upload_stream(
            {
                folder: "foo",

            },
            async function (error, result) {
                if (error) {
                    console.log(error);
                    return null
                }

                console.log(result)
                statement.reportLink = result.url;
                await statement.save()


            }
        );

        streamifier.createReadStream(_buffer).pipe(cld_upload_stream);
    }


}

export const uploadBankStatement = async (buffer, key) => {
    
    const statement = await AnalysedStatement.findOne({ key });

    console.log(buffer, key)

    let _buffer = new Buffer.from(buffer, 'base64');

    let cld_upload_stream = cloudinary.uploader.upload_stream(
        {
            folder: "foo",
            resource_type: 'raw'
        },
        async function (error, result) {
            if (error) {
                console.log("upload statement error", error);
                return null
            }

            console.log(result)
            statement.bankStatementLink = result.url;
            await statement.save()

        }
    );

    streamifier.createReadStream(_buffer).pipe(cld_upload_stream);

}

export default generator