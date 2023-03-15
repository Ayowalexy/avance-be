import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import connectDB from "./config/db.js";
import cors from "cors";
import passport from "passport";
import compression from "compression";
import authRoutes from './routes/authRoutes.js'
import statementRoutes from './routes/statementsRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import accountOfficerRoutes from './routes/account-officer.js'
import session from "express-session";
import getPericulumAccessToken from "./utils/periculumAccessToken.js";
import InvoiceGenerator from "./utils/generateTable.js";
import { sendAccountOfficerEmailOfNewSignmentInsight } from "./utils/sendAccountOfficerInsightEmail.js";

const invoiceData = {
  spendAnalysis:
  {
    "averageMonthlySpendOnTransfer": 67998.89,
    "averageMonthlySpendOnAtmAndPOS": 101171.2,
    "averageMonthlySpendOnUSSD": 18443,
    "averageMonthlySpendOnGambling": 0,
    "averageMonthlySpendOnAirtimeAndData": 18400,
    "averageMonthlySpendOnUtilities": 0,
    "averageMonthlySpendOnOnlineAndWeb": 101171.2,
    "averageMonthlySpendOnTransportation": 0,
    "averageMonthlySpendOnHealth": 0,
    "averageMonthlySpendOnTravel": 0,
    "averageMonthlySpendOnEntertainment": 2900,
    "averageMonthlySpendOnHospitalityAndFood": 0,
    "averageMonthlySpendOnRent": 0,
    "averageMonthlySpendOnInsurance": 0,
    "averageMonthlySpendOnChargesAndStampDuty": 934.99,
    "averageMonthlySpendOnInternationalTransactions": 0,
    "averageMonthlyTotalExpenses": 215902.34,
    "averageMonthlyRecurringExpense": 0,
    "averageMonthlySpendOnSavingsAndInvestments": 0,
    "averageMonthlySpendOnOthers": 25600,
    "averageMonthlyTransactionsViaAgents": 0,
    "averageMonthlySpendOnCrypto": 0,
    "mostRecurringExpense": "airtime_and_data_transactions",
    "totalSpendOnTransfer": 67998.89,
    "totalSpendOnAtmAndPOS": 101171.2,
    "totalSpendOnUSSD": 18443,
    "totalSpendOnGambling": 0,
    "totalSpendOnAirtimeAndData": 18400,
    "totalSpendOnUtilities": 0,
    "totalSpendOnOnlineAndWeb": 101171.2,
    "totalSpendOnTransportation": 0,
    "totalSpendOnHealth": 0,
    "totalSpendOnTravel": 0,
    "totalSpendOnEntertainment": 2900,
    "totalSpendOnHospitalityAndFood": 0,
    "totalSpendOnRent": 0,
    "totalSpendOnInsurance": 0,
    "totalSpendOnChargesAndStampDuty": 934.99,
    "totalSpendOnInternationalTransactions": 0,
    "totalMonthlyExpenses": 215902.34,
    "totalRecurringExpense": 0,
    "totalExpenses": 215902.34,
    "totalMonthlyExpense": 0,
    "totalSpendOnSavingsAndInvestments": 0,
    "totalSpendOnOthers": 25600,
    "totalTransactionsViaAgents": 0,
    "totalSpendOnCrypto": 0,
    "atmLocations": [],
    "mostFrequentSpendCategory": "airtime_and_data_transactions",
    "monthWithHighestSpend": "10/2022",
    "highestSpend": 216837.33,
    "mostFrequentExpense": "pos web pmt palmpay limited la lang",
    "mostFrequentExpenseAmount": 200
  },
  transactionPatternAnalysis: {
    "lastDayOfCredit": "2022-10-31",
    "lastDayOfDebit": "2022-10-31",
    "percentDebitTransactions": 0.85,
    "percentCreditTransactions": 0.15,
    "totalNumberOfTransactions": 99,
    "percentOfTransactionsLessThan10ThousandNaira": 0.96,
    "percentOfTransactionsBetween10ThousandTo100ThousandNaira": 0.03,
    "percentOfTransactionsBetween100ThousandTo500ThousandNaira": 0.01,
    "percentOfTransactionsBetween500ThousandToOneMillionNaira": 0,
    "percentOfTransactionsGreaterThanOneMillionNaira": 0,
    "percentNumberOfDaysTransactionsWasLessThan10ThousandNaira": 1,
    "percentOfBalancesLessThan10ThousandNaira": 0.32,
    "percentOfBalancesBetween10ThousandTo100ThousandNaira": 0.58,
    "percentOfBalancesBetween100ThousandTo500ThousandNaira": 0.1,
    "percentOfBalancesBetween500ThousandToOneMillionNaira": 0,
    "percentOfBalancesGreaterThanOneMillionNaira": 0,
    "percentNumberOfDaysBalanceWasLessThan10ThousandNaira": 0.48,
    "mostFrequentBalanceRange": "10000 to 100000 ",
    "mostFrequentTransactionRange": "<10000",
    "numberOfCardRequests": 0,
    "saccoTransactions": [],
    "topIncomingTransfer": null,
    "mostFrequentCreditTransfer": "oluwabiyi",
    "mostFrequentDebitTransfer": null,
    "topOutgoingTransfer": null,
    "returnCheque": 0,
    "missingTransactions": null,
  },
  behavioralAnalysis: {
    "monthToMonthInflowToOutflowRate": "Positive Cash Flow",
    "overallInflowToOutflowRate": "Positive Cash Flow",
    "latestLoanTransaction": [],
    "latestRepaymentTransaction": [
      {
        "date": "2022-10-05",
        "amount": 48152,
        "description": null
      }
    ],
    "loanTransactions": [],
    "loanRepaymentTransactions": [
      {
        "date": "2022-10-05 00:00:00",
        "amount": 48152,
        "description": "pos web pmt fairmoney 2157176758 pstk lang"
      }
    ],
    "totalLoanAmount": 0,
    "totalLoanRepaymentAmount": 48152,
    "loanInflowRate": null,
    "loanRepaymentToInflowRate": 0.61,
    "numberOfCreditLoanTransactions": null,
    "numberOfDebitRepaymentTransactions": null,
    "gamblingStatus": "No Gambling Transactions Found",
    "gamblingRate": 0,
    "accountActivity": 0.9,
    "percentOfInflowIrregularity": 0.21,
    "averageMonthlyLoanAmount": 0,
    "averageMonthlyLoanRepaymentAmount": 48152,
    "numberLoanTransactions": 0,
    "numberRepaymentTransactions": 1,
    "loanToInflowRate": 0,
    "accountSweep": "No",
    "numberOfBettingTransactions": 0
  },
  cashFlowAnalysis: {
    "totalCreditTurnover": 229078.5,
    "totalDebitTurnOver": 217033.54,
    "averageMonthlyCredits": 229078.5,
    "averageMonthlyDebits": 217033.54,
    "averageWeeklyCredits": 38179.75,
    "averageWeeklyDebits": 36172.26,
    "averageMonthlyBalance": 36112.98,
    "averageWeeklyBalance": 24098.84,
    "numberOfTransactingMonths": 1,
    "monthlyOutflow": [
      {
        "year": "2022",
        "month_name": "October",
        "amount": 217033.54
      }
    ],
    "monthlyInflow": [
      {
        "year": "2022",
        "month_name": "October",
        "amount": 229078.5
      }
    ],
    "weeklyInflow": [
      {
        "year": "2022",
        "month_name": "October",
        "week": "week 1",
        "amount": 178089.25
      },
      {
        "year": "2022",
        "month_name": "October",
        "week": "week 2",
        "amount": 12289.25
      },
      {
        "year": "2022",
        "month_name": "October",
        "week": "week 3",
        "amount": 21200
      },
      {
        "year": "2022",
        "month_name": "October",
        "week": "week 4",
        "amount": 17500
      }
    ],
    "weeklyOutflow": [
      {
        "year": "2022",
        "month_name": "October",
        "week": "week 1",
        "amount": 108147.13
      },
      {
        "year": "2022",
        "month_name": "October",
        "week": "week 2",
        "amount": 61321.33
      },
      {
        "year": "2022",
        "month_name": "October",
        "week": "week 3",
        "amount": 28846.21
      },
      {
        "year": "2022",
        "month_name": "October",
        "week": "week 4",
        "amount": 18718.87
      }
    ],
    "validCredit": 229078.5,
    "periodInStatement": "October - October",
    "yearInStatement": "2022",
    "firstDateInStatement": "2022-10-01",
    "lastDateInStatement": "2022-10-31",
    "closingBalance": 1689.25,
    "percentageOfExpenseOverInflow": 0.95
  },
  incomeAnalysis: {
    "salaryTransactions": [],
    "averagePredictedSalary": 0,
    "isSalaryEarner": "No",
    "expectedSalaryPaymentDay": null,
    "frequencyOfSalaryPayments": null,
    "lastDateOfSalaryPayment": null,
    "numberOfSalaryPayments": 0,
    "hasOtherIncome": "No",
    "otherIncomeTransactions": [],
    "averageOtherIncome": 0,
    "numberOfOtherIncomePayments": 0,
    "netAverageMonthlyEarning": 0,
    "lowestSalary": 0,
    "lowestSalaryDate": null,
    "mostRecentSalary": null
  },
  subtotal: 8000,
  paid: 0,
  invoiceNumber: 1234,
  dueDate: 'Feburary 02, 2021'
}

// const ig = new InvoiceGenerator(invoiceData)
// ig.generate()


// const vl = async () => {
  // await sendAccountOfficerEmailOfNewSignmentInsight(707)
// }

// vl()
import colors from "colors";

const app = express();

dotenv.config();



connectDB();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

const sessionConfig = {
  name: 'session',
  secret: 'session secret',
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    // secure: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
}

app.use(express.json());
app.use(compression());
app.use(express.urlencoded({ limit: "500mb", extended: true }));
app.use(cors());
app.use(session(sessionConfig));
app.use(passport.initialize())
app.use(passport.session())

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Server connected', status: 'success' })
})

app.use('/api/v1/users', authRoutes)
app.use('/api/v1/statement', statementRoutes)
app.use('/api/v1/admin', adminRoutes)
app.use('/api/v1/account-officer', accountOfficerRoutes)


app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;


app.listen(PORT, console.log(
  `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
));

