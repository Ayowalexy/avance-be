import fs from 'fs'
import PDFGenerator from 'pdfkit'

class InvoiceGenerator {
    constructor(invoice) {
        this.invoice = invoice
    }

    generateHeaders(doc) {
       
    }

    generateTable(doc) {
        const tableTop = 270
        const itemCodeX = 50
        const descriptionX = 100
        const quantityX = 250
        const priceX = 300
        const amountX = 350



        const spendAnalysis = this.invoice.spendAnalysis;
        const transactionPatternAnalysis = this.invoice.transactionPatternAnalysis;
        const behavioralAnalysis = this.invoice.behavioralAnalysis;
        const cashFlowAnalysis = this.invoice.cashFlowAnalysis;
        const incomeAnalysis = this.invoice.incomeAnalysis;

        let i = 0;

        doc
            .font('Helvetica-Bold')
            .fontSize(20)
            .text('Spend Analysis', itemCodeX, tableTop, { bold: true, underline: true })
            .text(' ')
            .text(' ')

        for (let item in spendAnalysis) {
            let value = spendAnalysis[item];
            let id = item.split(/(?=[A-Z])/).join(' ').toLocaleUpperCase();
            let name = id.concat(': ', value)

            const y = name.length + 25 + (i * 25)
            i = i + 1;
            doc
                .font('Courier')
                .fontSize(10)
                .text(name)
                .text(' ')
        }

        doc
            .font('Helvetica-Bold')
            .fontSize(20)
            .text(' ')
            .text(' ')
            .text('Transaction pattern analysis', itemCodeX, tableTop, { bold: true, underline: true })
            .text(' ')
            .text(' ')

        for (let item in transactionPatternAnalysis) {
            let value = transactionPatternAnalysis[item];
            let id = item.split(/(?=[A-Z])/).join(' ').toLocaleUpperCase();
            let name = id.concat(': ', value)

            const y = name.length + 25 + (i * 25)
            i = i + 1;

            if (Array.isArray(item)) {
                for (let element of item) {
                    let ele = element.split(/(?=[A-Z])/).join(' ').toLocaleUpperCase();
                    let val = item[element];
                    let name_ = ele.concat(': ', val)
                    doc
                        .font('Courier')
                        .fontSize(10)
                        .text(name_)
                        .text(' ')
                }
            } else {
                doc
                    .font('Courier')
                    .fontSize(10)
                    .text(name)
                    .text(' ')
            }

        }


        doc
            .font('Helvetica-Bold')
            .fontSize(20)
            .text(' ')
            .text(' ')
            .text('Behavioural analysis', itemCodeX, tableTop, { bold: true, underline: true })
            .text(' ')
            .text(' ')

        for (let item in behavioralAnalysis) {
            let value = behavioralAnalysis[item];
            let id = item.split(/(?=[A-Z])/).join(' ').toLocaleUpperCase();
            let name = id.concat(': ', value)

            const y = name.length + 25 + (i * 25)
            i = i + 1;

            // if(item === 'latestRepaymentTransaction'){
            //     console.log()
            // }

            if (Array.isArray(behavioralAnalysis[item])) {
                // console.log('is array', item)
                // for (let element in behavioralAnalysis[item]) {
                //     console.log(element)
                //     let ele = element.split(/(?=[A-Z])/).join(' ').toLocaleUpperCase();
                //     let val = behavioralAnalysis[item][element];
                //     let name_ = ele.concat(': ', val)
                //     doc
                //         .font('Courier')
                //         .fontSize(10)
                //         .text(name_)
                //         .text(' ')
                // }
            } else {
                doc
                    .font('Courier')
                    .fontSize(10)
                    .text(name)
                    .text(' ')
            }

        }

        doc
            .font('Helvetica-Bold')
            .fontSize(20)
            .text(' ')
            .text(' ')
            .text('Cash flow analysis', itemCodeX, tableTop, { bold: true, underline: true })
            .text(' ')
            .text(' ')

        for (let item in cashFlowAnalysis) {
            let value = cashFlowAnalysis[item];
            let id = item.split(/(?=[A-Z])/).join(' ').toLocaleUpperCase();
            let name = id.concat(': ', value)

            const y = name.length + 25 + (i * 25)
            i = i + 1;

            if (Array.isArray(item)) {
                for (let element of item) {
                    let ele = element.split(/(?=[A-Z])/).join(' ').toLocaleUpperCase();
                    let val = item[element];
                    let name_ = ele.concat(': ', val)
                    doc
                        .font('Courier')
                        .fontSize(10)
                        .text(name_)
                        .text(' ')
                }
            } else {
                doc
                    .font('Courier')
                    .fontSize(10)
                    .text(name)
                    .text(' ')
            }

        }

        doc
            .font('Helvetica-Bold')
            .fontSize(20)
            .text(' ')
            .text(' ')
            .text('Income analysis', itemCodeX, tableTop, { bold: true, underline: true })
            .text(' ')
            .text(' ')

        for (let item in incomeAnalysis) {
            let value = incomeAnalysis[item];
            let id = item.split(/(?=[A-Z])/).join(' ').toLocaleUpperCase();
            let name = id.concat(': ', value)

            const y = name.length + 25 + (i * 25)
            i = i + 1;

            if (Array.isArray(item)) {
                for (let element of item) {
                    let ele = element.split(/(?=[A-Z])/).join(' ').toLocaleUpperCase();
                    let val = item[element];
                    let name_ = ele.concat(': ', val)
                    doc
                        .font('Courier')
                        .fontSize(10)
                        .text(name_)
                        .text(' ')
                }
            } else {
                doc
                    .font('Courier')
                    .fontSize(10)
                    .text(name)
                    .text(' ')
            }

        }
    }


    generate() {
        console.log('generated')
        let theOutput = new PDFGenerator

        const fileName = `${this.invoice.name}.pdf`

        // pipe to a writable stream which would save the result into the same directory
        theOutput.pipe(fs.createWriteStream(fileName))

        // this.generateHeaders(theOutput)

        theOutput.moveDown()

        this.generateTable(theOutput)

        // this.generateFooter(theOutput)


        // write out file
        theOutput.end()

    }
}


export default InvoiceGenerator