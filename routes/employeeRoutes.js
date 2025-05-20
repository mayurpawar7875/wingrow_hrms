const express = require('express');
const router = express.Router();
const {
  registerEmployee,
  getAllEmployees,
  getEmployeeById,
  deleteEmployee,
} = require('../controllers/employeeController');

// POST /api/employees/register - Register an employee
router.post('/register', registerEmployee);

// GET /api/employees - Get all employees
// router.get('/', getAllEmployees);

// GET /api/employees/:id - Get employee by ID
// router.get('/:id', getEmployeeById);

// DELETE /api/employees/:id - Delete employee
// router.delete('/:id', deleteEmployee);

module.exports = router;
