import AccountingFirm from '../../models/accounting-firm.js'
import AnalysedStatement from '../../models/analysedStatement.js'
import notifyFirmOfNewReport from '../../utils/notify-firm.js';


export const assignReport= async (firm_id, report_id, comment = '') => {

    const firm = await AccountingFirm.findById({ _id: firm_id }).populate('accounts');
    const report = await AnalysedStatement.findById({ _id: report_id });

    if (firm.accounts.length === 0) {
        throw new Error('No account has been added to this firm')
    }

    if (firm && report) {
        firm.reports.push(report);
        report.analysingFirm = firm;

        await firm.save();
        await report.save();

        const firmAdmin = firm.accounts?.find((oneAccountant) => oneAccountant.role === 'admin');
        if (firmAdmin) {
            await notifyFirmOfNewReport(firmAdmin.email, firmAdmin.name, comment)
        } else {
            const oneUser = firm.accounts[0];
            await notifyFirmOfNewReport(oneUser.email, oneUser.name, comment)
        }
    } else {
        throw new Error('An error occured')
    }
}