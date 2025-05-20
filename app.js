// app.js
const express = require('express');
const app = express();
const cors = require('cors');

// Import routes
const authRoutes = require('./routes/authRoutes');
// const marketRoutes = require('./routes/marketRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
// const notificationRoutes = require('./routes/notificationRoutes');
// const reportRoutes = require('./routes/reportRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const stallsRoutes = require('./routes/stallsRoutes');
const gpsRoutes = require('./routes/gpsRoutes');
const marketRoutes = require("./routes/marketRoutes");
const marketFileRoutes = require('./routes/marketFileRoutes');



// Middleware to parse JSON
app.use(express.json());
app.use(cors({ origin: true, credentials: true }));

// Mount Routers
app.use('/api/auth', authRoutes);

app.use('/api/attendance', attendanceRoutes);
app.use("/api/market", marketRoutes); // ✅ This makes the /api/market/list route available
app.use('/api/employees', employeeRoutes);
app.use('/api/stalls', stallsRoutes);
app.use('/api/gps', gpsRoutes);
app.use('/api/market', marketFileRoutes);



module.exports = app;
