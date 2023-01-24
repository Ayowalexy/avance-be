import asyncHandler from "express-async-handler";
import axios from "axios";
import dotenv from "dotenv";
import useAxios from "../utils/apicall.js";
import User from '../models/usermodel.js'
import { automaticProcessingSchema, deleteBankAccountSchema } from "../utils/schema.js";
import Account from "../models/banksAccountModel.js";


