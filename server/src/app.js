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
const loginAttemptRoutes = require("./routes/loginAttemptRoutes");
const permissionRoutes = require("./routes/permissionRoutes");
const securitySettingsRoutes = require("./routes/securitySettingsRoutes");
const systemDashboardRoutes = require("./routes/systemDashboardRoutes");

const managerRoutes = require("./routes/managerRoutes");



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
app.use("/api/system/login-monitoring", loginAttemptRoutes);
app.use("/api/system/permissions", permissionRoutes);
app.use("/api/system/security-settings", securitySettingsRoutes);
app.use("/api/system/dashboard", systemDashboardRoutes);

app.use("/api/manager", managerRoutes);


module.exports = app;
