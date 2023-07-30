import Joi from 'joi';


const signupscchema = Joi.object({
    firstName: Joi
        .string()
        .required(),
    lastName: Joi
        .string()
        .required(),
    password: Joi
        .string()
        .required(),
    confirm_password: Joi
        .any()
        .equal(Joi.ref('password'))
        .required()
        .label('Confirm password')
        .options({ messages: { 'any.only': '{{#label}} does not match password' } }),
    email: Joi
        .string()
        .email()
        .required(),
})

const loginSchema = Joi.object({

    password: Joi
        .string()
        .required(),
    email: Joi
        .string()
        .email()
        .required(),
})

const emailSchema = Joi.object({
    email: Joi
        .string()
        .email()
        .required(),
})

const otpSchema = Joi.object({
    otp: Joi
        .string()
        .required(),
    email: Joi
        .string()
        .email()
        .required()
})

const waitlistSchemaIndividual = Joi.object({
    email: Joi
        .string()
        .email()
        .required(),
    firstName: Joi
        .string()
        .required(),
    lastName: Joi
        .string()
        .required(),
    phoneNumber: Joi
        .string()
        .required(),
    occupation: Joi
        .string()
        .required(),
    category: Joi
        .string()
        .valid('Individual', 'Organization')
        .required(),
})

const waitlistSchemaOrganization = Joi.object({
    email: Joi
        .string()
        .email()
        .required(),
    typeOfOrganization: Joi
        .string()
        .required(),
    firstName: Joi
        .string()
        .required(),
    lastName: Joi
        .string()
        .required(),
    phoneNumber: Joi
        .string()
        .required(),
    website: Joi
        .string(),
    companyName: Joi
        .string()
        .required(),
    companyEmail: Joi
        .string(),
    category: Joi
        .string()
        .valid('Individual', 'Organization')
        .required(),
})

const passwordSchema = Joi.object({
    password: Joi
        .string()
        .required(),
    email: Joi
        .string()
        .email()
        .required()
})

const applicantsSchema = Joi
    .object()
    .keys({
        name: Joi.string().required(),
        applicationNo: Joi.string().allow(null).allow('')
    })

const automaticProcessingSchema = Joi.object({

    accountNo: Joi
        .string()
        .required(),
    phone: Joi
        .number()
        .required(),
    startDate: Joi
        .string()
        .required(),
    endDate: Joi
        .string()
        .required(),
    bankId: Joi
        .number()
        .required(),
    role: Joi
        .string()
        .valid('Applicant', 'Sponsor', 'Guarantor')
        .required(),
    bankName: Joi
        .string()
        .required()
    // country: Joi
    //     .string()
    //     .required(),
    // applicants: Joi
    //     .array()
    //     .items(applicantsSchema)
})


const confirmSchema = Joi.object({
    ticketNo: Joi
        .string()
        .required(),
    password: Joi
        .string()
        .required(),

    //new schema addtition
    accountNo: Joi
        .string()
        .required(),
    phone: Joi
        .number()
        .required(),
    startDate: Joi
        .string()
        .required(),
    endDate: Joi
        .string()
        .required(),
    bankId: Joi
        .number()
        .required(),
    role: Joi
        .string()
        .valid('Applicant', 'Sponsor', 'Guarantor')
        .required(),
    bankName: Joi
        .string()
        .required()
})

const deleteBankAccountSchema = Joi.object({
    id: Joi
        .string()
        .required()
})


const adminSchema = Joi.object({
    firstName: Joi
        .string()
        .required(),
    lastName: Joi
        .string()
        .required(),
    email: Joi
        .string()
        .email()
        .required(),
    password: Joi
        .string()
        .required()
})


const adminLoginSchema = Joi.object({
    email: Joi
        .string()
        .email()
        .required(),
    password: Joi
        .string()
        .required()
})



const statementProcessSchema = Joi.object({
    key: Joi
        .number()
        .required(),

})

const statementReportSchema = Joi.object({
    amount: Joi
        .number()
        .required(),
    key: Joi.number().required(),
    report: Joi
        .any()
})


const statementStatusSchema = Joi.object({

    key: Joi.number().required(),
    status: Joi.valid('processing', 'declined', 'completed').required()
})

const statement = Joi.object({
    key: Joi.number().required(),
    sla: Joi.string().required(),
    engagementLetterLink: Joi.string().required()
})

const sendEmailShema = Joi.object({
    header: Joi.string().required(),
    message: Joi.string().required(),
    id: Joi.string().required()
})


const loand_d = Joi.object({
    loans: Joi.array().items(
        Joi.object({
            type: Joi
                .string()
                .valid('Deposit', 'Loan', 'Bank statement', 'Engagement letter')
                .required(),
            loan: Joi
                .string()
                .required(),
            documents: Joi.array()
        }).required()
    ),
    key: Joi
        .number()
        .required()
})


const statusSchema = Joi.object({
    message: Joi.string().required(),
    key: Joi.number().required()
})

const manualStatementAssign = Joi.object({
    key: Joi.number().required(),
    id: Joi.string().required()
})

const recoveryReequestSchema = Joi.object({
    key: Joi.number().required(),
    pdfUrl: Joi.string().required()
})


const createBusinessDeveloperSchema = Joi.object({
    email: Joi.string().email().required(),
    fullName: Joi.string().required(),
    phoneNumber: Joi.string().required()
})


const changePasswordShema = Joi.object({
    password: Joi
        .string()
        .required(),
    confirm_password: Joi
        .any()
        .equal(Joi.ref('password'))
        .required()
        .label('Confirm password')
        .options({ messages: { 'any.only': '{{#label}} does not match password' } }),
    new_password: Joi
        .string()
        .required(),
})


const createNewAccountingFirmSchema = Joi.object({
    name: Joi.string().required(),
    no_of_accountants: Joi.number().required()
})

const createNewAccountSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    role: Joi.string().valid('admin', 'user')
})

const updateStatusSchema = Joi.object({
    status: Joi.string().valid('active', 'suspended').required()
})

const assignReportSchema = Joi.object({
    firm_id: Joi.string().required(),
    report_id: Joi.string().required(),
    comment: Joi.string().optional()
})

const reassignReportSchema = Joi.object({
    firm_id: Joi.string().required(),
    report_id: Joi.string().required(),
    analysingFirm: Joi.string().required()
})

export {
    signupscchema,
    loginSchema,
    emailSchema,
    otpSchema,
    passwordSchema,
    automaticProcessingSchema,
    confirmSchema,
    deleteBankAccountSchema,
    adminSchema,
    adminLoginSchema,
    statementProcessSchema,
    statementReportSchema,
    statementStatusSchema,
    loand_d,
    statement,
    statusSchema,
    manualStatementAssign,
    recoveryReequestSchema,
    waitlistSchemaIndividual,
    waitlistSchemaOrganization,
    sendEmailShema,
    createBusinessDeveloperSchema,
    changePasswordShema,
    createNewAccountingFirmSchema,
    createNewAccountSchema,
    assignReportSchema,
    reassignReportSchema,
    updateStatusSchema
}