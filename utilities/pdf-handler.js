import chromium from 'chrome-aws-lambda';
import { cloudinary } from '../cloudinary/cloudinary.js';
import streamifier from 'streamifier'
import AnalysedStatement from '../models/analysedStatement.js';

const handler = async (htmlString, key, name) => {

    let result = null;
    let statement;

    const browser = await chromium.puppeteer.launch({
        args: chromium.args,
        executablePath: await chromium.executablePath,
        headless: true//chromium.headless,
    });

    try {

        statement = statement = await AnalysedStatement.findOne({ key });

        // statement = statement.length > 1 ? statement[statement.length - 1] : statement[0];

        const page = await browser.newPage();
        await page.setContent(htmlString, { waitUntil: 'networkidle0' });
        result = await page.pdf({ path: name?.concat('.pdf'), format: 'A4' });
        console.log('result', result)

        let _buffer = new Buffer.from(result, 'base64');
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
    } catch (error) {
        console.error(error);
    } finally {
        if (browser) {
            await browser.close();
        }
    }

    return result;
};

export default handler;