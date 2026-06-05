import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import Login from "./pages/Login";

// HR pages
import AdminDashboard from "./pages/HR/AdminDashboard";
import ManagerDashboard from "./pages/manager/ManagerDashboard";
import AgentDashboard from "./pages/AgentDashboard";
import Employees from "./pages/HR/employee/Employees";
import CreateEmployee from "./pages/HR/employee/CreateEmployee";
import EditEmployee from "./pages/HR/employee/EditEmployee";
import EmployeeDetails from "./pages/HR/employee/EmployeeDetails";

import Departments from "./pages/HR/department/Departments";
import EditDepartment from "./pages/HR/department/EditDepartment";

import Teams from "./pages/HR/team/Teams";
import EditTeam from "./pages/HR/team/EditTeam";

// System admin pages
import SystemUsers from "./pages/system/SystemUsers";
import SystemDashboard from "./pages/system/SystemDashboard";
import AuditLogs from "./pages/system/AuditLogs";
import LoginMonitoring from "./pages/system/LoginMonitoring";
import Permissions from "./pages/system/Permissions";
import SecuritySettings from "./pages/system/SecuritySettings";

// Manager pages
import MyTeam from "./pages/manager/MyTeam";
import EmployeeProfile from "./pages/manager/EmployeeProfile";
import Announcements from "./pages/Manager/Announcements";

import AuthLoader from "./components/AuthLoader";
import ProtectedRoute from "./routes/ProtectedRoute";


function App() {

    return (
        <BrowserRouter>

            <AuthLoader />
                <Routes>

                    <Route
                        path="/manager/announcements"
                        element={
                            <ProtectedRoute
                                roles={["manager"]}
                            >
                                <Announcements />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/manager/team/:id"
                        element={
                            <ProtectedRoute
                                roles={["manager"]}
                            >
                                <EmployeeProfile />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/manager/dashboard"
                        element={
                            <ProtectedRoute
                                roles={["manager"]}
                            >
                                <ManagerDashboard />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/manager/team"
                        element={
                            <ProtectedRoute
                                roles={["manager"]}
                            >
                                <MyTeam />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/system/security-settings"
                        element={
                            <ProtectedRoute roles={["admin", "super_admin"]}>
                                <SecuritySettings />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/system/permissions"
                        element={
                            <ProtectedRoute roles={["admin", "super_admin"]}>
                                <Permissions />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/system/login-monitoring"
                        element={
                            <ProtectedRoute roles={["admin", "super_admin"]}>
                                <LoginMonitoring />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/system/audit-logs"
                        element={
                            <ProtectedRoute roles={["admin", "super_admin"]}>
                                <AuditLogs />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/system/users"
                        element={
                            <ProtectedRoute
                                roles={["admin", "super_admin"]}
                            >
                                <SystemUsers />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/system/dashboard"
                        element={
                            <ProtectedRoute
                                roles={["admin", "super_admin"]}
                            >
                                <SystemDashboard />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/admin/dashboard"
                        element={<Navigate to="/system/dashboard" replace />}
                    />

                    <Route
                        path="/admin/system/users"
                        element={<Navigate to="/system/users" replace />}
                    />

                    <Route
                        path="/admin/audit-logs"
                        element={<Navigate to="/system/audit-logs" replace />}
                    />

                    <Route
                        path="/admin/permissions"
                        element={<Navigate to="/system/permissions" replace />}
                    />

                    <Route
                        path="/admin/login-monitoring"
                        element={<Navigate to="/system/login-monitoring" replace />}
                    />

                    <Route
                        path="/admin/security-settings"
                        element={<Navigate to="/system/security-settings" replace />}
                    />

                    <Route
                        path="/hr/teams/edit/:id"
                        element={
                            <ProtectedRoute roles={["hr"]}>
                                <EditTeam />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/hr/teams"
                        element={
                            <ProtectedRoute roles={["hr"]}>
                                <Teams />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/hr/departments/edit/:id"
                        element={
                            <ProtectedRoute roles={["hr"]}>
                                <EditDepartment />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/hr/departments"
                        element={
                            <ProtectedRoute roles={["hr"]}>
                                <Departments />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/hr/employees/:id"
                        element={
                            <ProtectedRoute roles={["hr"]}>
                                <EmployeeDetails />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/hr/employees/edit/:id"
                        element={
                            <ProtectedRoute roles={["hr"]}>
                                <EditEmployee />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/hr/employees/create"
                        element={
                            <ProtectedRoute roles={["hr"]}>
                                <CreateEmployee />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/hr/employees"
                        element={
                            <ProtectedRoute roles={["hr"]}>
                                <Employees />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/"
                        element={<Navigate to="/login" replace />}
                    />

                    <Route
                        path="/login"
                        element={<Login />}
                    />

                    <Route
                        path="/hr/dashboard"
                        element={
                            <ProtectedRoute
                                roles={["hr"]}
                            >
                                <AdminDashboard />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/agent/dashboard"
                        element={
                            <ProtectedRoute
                                roles={["agent"]}
                            >
                                <AgentDashboard />
                            </ProtectedRoute>
                        }
                    />

                </Routes>

        </BrowserRouter>
    );
}

export default App;
