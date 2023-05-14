import { create_pdf } from "../utils/pdf.js";

export const generateStatementHtml = async (data) => {
    const spendAnalysis = data?.spendAnalysis || data?.SpendAnalysis;
    const transactionPatternAnalysis = data?.transactionPatternAnalysis || data?.TransactionPatternAnalysis;
    const behavioralAnalysis = data?.behavioralAnalysis || data?.BehavioralAnalysis;
    const cashFlowAnalysis = data?.cashFlowAnalysis || data?.CashFlowAnalysis;

    const spendAnalysisReport = {
        highestSpend: spendAnalysis.highestSpend,
        totalExpenses: spendAnalysis.totalExpenses,
        averageMonthlyTotalExpenses: spendAnalysis.averageMonthlyTotalExpenses,
        averageMonthlySpendOnAtmAndPOS: spendAnalysis.averageMonthlySpendOnAtmAndPOS,
        averageMonthlySpendOnAirtimeAndData: spendAnalysis.averageMonthlySpendOnAirtimeAndData,
        averageMonthlySpendOnChargesAndStampDuty: spendAnalysis.averageMonthlySpendOnChargesAndStampDuty,
        averageMonthlySpendOnEntertainment: spendAnalysis.averageMonthlySpendOnEntertainment,
        averageMonthlySpendOnOnlineAndWeb: spendAnalysis.averageMonthlySpendOnOnlineAndWeb,
        averageMonthlySpendOnOthers: spendAnalysis.averageMonthlySpendOnOthers,
        averageMonthlySpendOnTransfer: spendAnalysis.averageMonthlySpendOnTransfer,
        averageMonthlySpendOnUSSD: spendAnalysis.averageMonthlySpendOnUSSD,
        totalSpendOnAtmAndPOS: spendAnalysis.totalSpendOnAtmAndPOS,
        totalSpendOnAirtimeAndData: spendAnalysis.totalSpendOnAirtimeAndData,
        totalSpendOnChargesAndStampDuty: spendAnalysis.totalSpendOnChargesAndStampDuty,
        totalSpendOnEntertainment: spendAnalysis.totalSpendOnEntertainment,
        totalSpendOnOnlineAndWeb: spendAnalysis.totalSpendOnOnlineAndWeb,
        totalSpendOnOthers: spendAnalysis,
        totalSpendOnTransfer: spendAnalysis.totalSpendOnTransfer,
        totalSpendOnUSSD: spendAnalysis.totalSpendOnUSSD
    }

    const transactionpattern = {
        percentDebitTransactions: transactionPatternAnalysis.percentDebitTransactions * 100,
        percentCreditTransactions: transactionPatternAnalysis.percentCreditTransactions * 100,
        totalNumberOfTransactions: transactionPatternAnalysis.totalNumberOfTransactions,
        percentOfTransactionsLessThan10ThousandNaira: transactionPatternAnalysis.percentOfTransactionsLessThan10ThousandNaira * 100,
        percentOfTransactionsBetween10ThousandTo100ThousandNaira: transactionPatternAnalysis.percentOfTransactionsBetween10ThousandTo100ThousandNaira * 100,
        percentOfTransactionsBetween100ThousandTo500ThousandNaira: transactionPatternAnalysis.percentOfTransactionsBetween100ThousandTo500ThousandNaira * 100,
        percentOfTransactionsBetween500ThousandToOneMillionNaira: transactionPatternAnalysis.percentOfTransactionsBetween500ThousandToOneMillionNaira * 100,
        percentNumberOfDaysTransactionsWasLessThan10ThousandNaira: transactionPatternAnalysis.percentNumberOfDaysTransactionsWasLessThan10ThousandNaira * 100,
        percentOfBalancesLessThan10ThousandNaira: transactionPatternAnalysis.percentOfBalancesLessThan10ThousandNaira * 100,
        percentOfBalancesBetween10ThousandTo100ThousandNaira: transactionPatternAnalysis.percentOfBalancesBetween10ThousandTo100ThousandNaira * 100,
        percentOfBalancesBetween500ThousandToOneMillionNaira: transactionPatternAnalysis.percentOfBalancesBetween500ThousandToOneMillionNaira * 100,
        percentOfBalancesGreaterThanOneMillionNaira: transactionPatternAnalysis.percentOfBalancesGreaterThanOneMillionNaira * 100,
        percentNumberOfDaysBalanceWasLessThan10ThousandNaira: transactionPatternAnalysis.percentNumberOfDaysBalanceWasLessThan10ThousandNaira * 100,
        mostFrequentBalanceRange: transactionPatternAnalysis.mostFrequentBalanceRange,
        mostFrequentTransactionRange: transactionPatternAnalysis.mostFrequentTransactionRange
    }


    const behavioralAnalysisReport = {
        totalLoanRepaymentAmount: behavioralAnalysis.totalLoanRepaymentAmount,
        loanRepaymentToInflowRate: behavioralAnalysis.loanRepaymentToInflowRate * 100,
        numberLoanTransactions: behavioralAnalysis.numberLoanTransactions,
        totalLoanAmount: behavioralAnalysis.totalLoanAmount ? behavioralAnalysis.totalLoanAmount : 0,
        numberRepaymentTransactions: behavioralAnalysis.numberRepaymentTransactions,
        accountActivity: behavioralAnalysis.accountActivity * 100,
        gamblingRate: behavioralAnalysis.gamblingRate,
        overallInflowToOutflowRate: behavioralAnalysis.overallInflowToOutflowRate,
        accountSweep: behavioralAnalysis.accountSweep,
        percentOfInflowIrregularity: behavioralAnalysis.percentOfInflowIrregularity * 100,
        averageMonthlyLoanAmount: behavioralAnalysis.averageMonthlyLoanAmount,
    }


    const cashFlowAnalysisPattern = {
        validCredit: cashFlowAnalysis.validCredit,
        closingBalance: cashFlowAnalysis.closingBalance,
        percentageOfExpenseOverInflow: cashFlowAnalysis.percentageOfExpenseOverInflow * 100,
        totalCreditTurnover: cashFlowAnalysis.totalCreditTurnover,
        totalDebitTurnOver: cashFlowAnalysis.totalDebitTurnOver,
        averageMonthlyDebits: cashFlowAnalysis.averageMonthlyDebits,
        averageWeeklyCredits: cashFlowAnalysis.averageWeeklyCredits,
        averageMonthlyBalance: cashFlowAnalysis.averageMonthlyBalance,
        averageWeeklyBalance: cashFlowAnalysis.averageWeeklyBalance,
    }

    const str_html = create_pdf(spendAnalysisReport, transactionpattern, cashFlowAnalysisPattern, behavioralAnalysisReport);
    return str_html
}