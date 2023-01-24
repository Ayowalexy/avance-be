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
        .options({ messages: { 'any.only': '{{#label}} does not match password'} }),
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
        .required()
})

const deleteBankAccountSchema = Joi.object({
    id: Joi
        .string()
        .required()
})


export {
    signupscchema,
    loginSchema,
    emailSchema,
    otpSchema,
    passwordSchema,
    automaticProcessingSchema,
    confirmSchema,
    deleteBankAccountSchema
    
}