const express = require('express');
const cors = require('cors');
const cookieParse = require('cookie-parser');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require("./routes/adminRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const departmentRoutes = require("./routes/departmentRoutes");
const teamRoutes = require("./routes/teamRoutes");


const systemUserRoutes = require("./routes/systemUserRoutes");
const auditLogRoutes = require("./routes/auditLogRoutes");


const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParse());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use("/api/hr", adminRoutes);
app.use("/api/hr/employees", employeeRoutes);
app.use("/api/hr/departments", departmentRoutes);
app.use("/api/hr/teams", teamRoutes);

app.use("/api/system/users", systemUserRoutes);
app.use("/api/system/audit-logs", auditLogRoutes);
module.exports = app;
