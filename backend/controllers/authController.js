const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


// const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find the user in the database
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        // ✅ **Ensure userId is included in the response**
        res.status(200).json({
            success: true,
            token: token,  
            userId: user._id.toString() // Convert ObjectId to String
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Server error" });
    }
};




// @desc    Add an employee to the user collection
// @route   POST /api/auth/add-employee
// @access  Admin-only (or use it without authentication for now)
exports.addEmployee = async (req, res) => {
  const { username, password, role, phone } = req.body;

  try {
    // Check if employee already exists
    let user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Hashed password being saved:', hashedPassword);

    // Create new employee with hashed password
    user = new User({
      username,
      password: hashedPassword,
      role,
      phone,
    });

    await user.save();
    res.status(201).json({ success: true, message: 'Employee added successfully' });
  } catch (error) {
    console.error('Error during employee addition:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};





