import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import Login from "./pages/Login";

// HR pages
import AdminDashboard from "./pages/HR/AdminDashboard";
import ManagerDashboard from "./pages/ManagerDashboard";
import AgentDashboard from "./pages/AgentDashboard";
import Employees from "./pages/HR/employee/Employees";
import CreateEmployee from "./pages/HR/employee/CreateEmployee";
import EditEmployee from "./pages/HR/employee/EditEmployee";
import EmployeeDetails from "./pages/HR/employee/EmployeeDetails";
import HRAuditLogs from "./pages/HR/employee/AuditLogs";

import Departments from "./pages/HR/department/Departments";
import EditDepartment from "./pages/HR/department/EditDepartment";

import Teams from "./pages/HR/team/Teams";
import EditTeam from "./pages/HR/team/EditTeam";

// System admin pages
import SystemUsers from "./pages/admin/SystemUsers";
import SystemDashboard from "./pages/admin/SystemDashboard";
import AuditLogs from "./pages/admin/AuditLogs";
import LoginMonitoring from "./pages/admin/LoginMonitoring";
import Permissions from "./pages/admin/Permissions";

import AuthLoader from "./components/AuthLoader";
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {

    return (
        <BrowserRouter>

            <AuthLoader />
                <Routes>

                    <Route
                        path="/admin/permissions"
                        element={
                            <ProtectedRoute roles={["admin", "super_admin"]}>
                                <Permissions />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/admin/login-monitoring"
                        element={
                            <ProtectedRoute roles={["admin", "super_admin"]}>
                                <LoginMonitoring />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                            path="/admin/audit-logs"
                            element={
                                <ProtectedRoute roles={["admin", "super_admin"]}>
                                    <AuditLogs />
                                </ProtectedRoute>
                            }
                        />

                    <Route
                        path="/admin/system/users"
                        element={
                            <ProtectedRoute
                                roles={["admin", "super_admin"]}
                            >
                                <SystemUsers />
                            </ProtectedRoute>
                        }
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
                        path="/hr/audit-logs"
                        element={
                            <ProtectedRoute roles={["hr"]}>
                                <AuditLogs />
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
                        path="/admin/dashboard"
                        element={
                            <ProtectedRoute
                                roles={["admin", "super_admin"]}
                            >
                                <SystemDashboard />
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
