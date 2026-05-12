const express = require('express');
const cors = require('cors');
const cookieParse = require('cookie-parser');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require("./routes/adminRoutes");
const employeeRoutes = require("./routes/employeeRoutes");


const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParse());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin/employees", employeeRoutes);

module.exports = app;