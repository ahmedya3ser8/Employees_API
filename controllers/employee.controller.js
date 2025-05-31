import Joi from "joi";
import EmployeeModel from "../models/employee.model.js";
import { ERROR, FAIL, SUCCESS } from "../utils/httpStatus.js";

const getAllEmployees = async (req, res) => {
  const query = req.query;
  const limit = query.limit || 10;
  const page = query.page || 1;
  const skip = (page - 1) * limit;
  const total = await EmployeeModel.countDocuments();
  const employees = await EmployeeModel.find({}, {"__v": false}).limit(limit).skip(skip);
  return res.status(200).json({status: SUCCESS, data: { employees }, total})
}

const getEmployee = async (req, res) => {
  try {
    const employee = await EmployeeModel.findById(req.params.empId);
    if (!employee) {
      return res.status(404).json({status: FAIL, data: {message: 'Employee not found'}})
    }
    return res.status(200).json({status: SUCCESS, data: { employee }})
  } catch (error) {
    return res.status(500).json({status: ERROR, message: 'Invalid Object Id', error: error.message})
  }
}

const addEmployee = async (req, res) => {
  const schema = Joi.object({
    empName: Joi.string().required().messages({
      'string.base': 'empName must be a string',
      'string.empty': 'empName is required'
    }),
    empEmail: Joi.string().required().email().messages({
      'string.base': 'empEmail must be a string',
      'string.empty': 'empEmail is required',
      'string.email': 'empEmail is not valid'
    }),
    empAddress: Joi.string().required().messages({
      'string.base': 'empAddress must be a string',
      'string.empty': 'empAddress is required'
    }),
    empPhone: Joi.string().required().messages({
      'string.base': 'empPhone must be a string',
      'string.empty': 'empPhone is required'
    })
  })
  const { error, value } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({status: FAIL, data: {message: error.details[0].message}})
  }
  try {
    const existEmail = await EmployeeModel.findOne({empEmail: value.empEmail});
    if (existEmail) {
      return res.status(409).json({status: FAIL, data: { message: 'empEmail already exists' }})
    }
    const newEmployee = new EmployeeModel(value);
    await newEmployee.save();
    return res.status(201).json({status: SUCCESS, data: {employee: newEmployee}});
  } catch (error) {
    return res.status(500).json({status: ERROR, message: 'Failed to add course', error: error.message })
  }
}

const updateEmployee = async (req, res) => {
  try {
    const updateEmployee = await EmployeeModel.updateOne({_id: req.params.empId}, {$set: {...req.body}});
    if (updateEmployee.matchedCount === 0) {
      return res.status(404).json({status: FAIL, data: {message: 'employee not found'}})
    }
    return res.status(200).json({status: SUCCESS, data: {message: 'employee updated successfully'}});
  } catch (error) {
    return res.status(500).json({status: ERROR, message: 'Invalid Object Id', error: error.message});
  }
}

const deleteEmployee = async (req, res) => {
  try {
    const deletedEmployee = await EmployeeModel.deleteOne({_id: req.params.empId});
    if (deletedEmployee.deletedCount === 0) {
      return res.status(404).json({status: FAIL, data: {message: 'employee not found'}})
    }
    return res.status(200).json({status: SUCCESS, data: {message: 'employee deleted successfully'}});
  } catch (error) {
    return res.status(500).json({status: ERROR, message: 'Invalid Object Id', error: error.message});
  }
}

export { getAllEmployees, getEmployee, addEmployee, updateEmployee, deleteEmployee }
