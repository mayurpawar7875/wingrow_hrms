const express = require('express');
const router = express.Router();
const { addEmployee, login } = require('../controllers/authController');

// Route to add an employee
router.post('/add-employee', addEmployee);

// Route to log in
router.post('/login', login);

module.exports = router;
