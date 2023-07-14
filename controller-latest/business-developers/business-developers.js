import AccountingFirm from "../../models/accounting-firm.js";
import asyncHandler from "express-async-handler";
import Accountants from "../../models/accountant.js";
import BusinessDevelopers from "../../models/business-developers.js";
import { updateStatusSchema } from "../../utils/schema.js";


const getAllBusinessDevelopers = asyncHandler(async (req, res) => {
    const data = await BusinessDevelopers.find({}, { password: 0 });
    res
        .status(200)
        .json(
            {
                status: 'success',
                data,
                meta: {}
            })
})

const getOneBusinessDeveloper = asyncHandler(async (req, res) => {
    const { id } = req.params
    const bd = await BusinessDevelopers.findById({ _id: id }, { password: 0 });
    if (bd) {
        res
            .status(200)
            .json(
                {
                    status: 'success',
                    data: bd,
                    meta: {}
                })
    } else {
        res
            .status(401)
            .json(
                {
                    status: "error",
                    message: "invalid request",
                    meta: {
                        error: `Business developer with id ${id} does not exist`
                    }
                })
    }
})


const suspendBusinessDeveloper = asyncHandler(async (req, res) => {
    const { error, value } = updateStatusSchema.validate(req.body);
    if (error) {
        return res
            .status(401)
            .json(
                {
                    status: "error",
                    message: "invalid request",
                    meta: {
                        error: error.message
                    }
                })
    }

    const { id } = req.params;

    await BusinessDevelopers.findByIdAndUpdate(
        { _id: id },
        { status: value.status }
    )
    res
        .status(200)
        .json(
            {
                status: 'success',
                message: "Status updates successfully",
                meta: {}
            })
})

const deleteBusinesDeveloper = asyncHandler(async (req, res) => {
    const { id } = req.params;
    await BusinessDevelopers.findByIdAndDelete({ _id: id });
    res
        .status(200)
        .json(
            {
                status: 'success',
                message: "Status updates successfully",
                meta: {}
            })
})

export {
    getAllBusinessDevelopers,
    getOneBusinessDeveloper,
    deleteBusinesDeveloper,
    suspendBusinessDeveloper
}