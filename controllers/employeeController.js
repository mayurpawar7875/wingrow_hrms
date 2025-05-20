const Employee = require('../models/Employee');

// Register Employee
exports.registerEmployee = async (req, res) => {
  const {
    firstName,
    lastName,
    username,
    designation,
    employeeId,
    password,
  } = req.body;

  // Validate input
  if (
    !firstName ||
    !lastName ||
    !username ||
    !designation ||
    !employeeId ||
    !password
  ) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    // Check if username or Employee ID already exists
    const existingEmployee = await Employee.findOne({
      $or: [{ username }, { employeeId }],
    });
    if (existingEmployee) {
      return res.status(400).json({
        message:
          'Username or Employee ID already exists. Please choose another.',
      });
    }

    // Create new employee
    const newEmployee = new Employee({
      firstName,
      lastName,
      username,
      designation,
      employeeId,
      password,
    });

    await newEmployee.save();

    res.status(201).json({ message: 'Employee registered successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

// Other controller methods remain unchanged
