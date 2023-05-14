import pdf from 'html-pdf';
import streamifier from 'streamifier'
import { cloudinary } from './cloudinary/cloudinary.js';
import html_to_pdf from 'html-pdf-node'
import AnalysedStatement from './models/analysedStatement.js';

const options = { format: 'Letter', timeout: 90000 };


export const statementFileGenerator = async (html, key, reportId) => {
    try {
        let statement;

        if (key) {
            statement = await AnalysedStatement.findOne({ key });
        } else if (reportId) {
            statement = await AnalysedStatement.findOne({ reportId });
        }
        if (statement) {
            pdf.create(html, options).toBuffer(function (err, buffer) {
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
                        console.log(result);
                        statement.reportLink = result.url;
                        await statement.save()
                    }
                );
                streamifier.createReadStream(_buffer).pipe(cld_upload_stream);
            });
        }

    } catch (e) {
        console.log(e)
    }
}