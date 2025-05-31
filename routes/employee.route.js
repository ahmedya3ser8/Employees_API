import express from 'express'
import { addEmployee, deleteEmployee, getAllEmployees, getEmployee, updateEmployee } from '../controllers/employee.controller.js';

const employeeRouter = express.Router();

employeeRouter.route('/')
  .get(getAllEmployees)
  .post(addEmployee);

employeeRouter.route('/:empId')
  .get(getEmployee)
  .patch(updateEmployee)
  .delete(deleteEmployee)

export default employeeRouter;
