import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import Login from "./pages/Login";

import AdminDashboard from "./pages/AdminDashboard";
import ManagerDashboard from "./pages/ManagerDashboard";
import AgentDashboard from "./pages/AgentDashboard";
import Employees from "./pages/employee/Employees";
import CreateEmployee from "./pages/employee/CreateEmployee";
import EditEmployee from "./pages/employee/EditEmployee";
import EmployeeDetails from "./pages/employee/EmployeeDetails";
import AuditLogs from "./pages/employee/AuditLogs";

import Departments from "./pages/department/Departments";
import EditDepartment from "./pages/department/EditDepartment";

import Teams from "./pages/team/Teams";

import AuthLoader from "./components/AuthLoader";
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {

    return (
        <BrowserRouter>

            <AuthLoader />
                <Routes>

                    <Route
                        path="/admin/teams"
                        element={
                            <ProtectedRoute roles={["admin"]}>
                                <Teams />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/admin/departments/edit/:id"
                        element={
                            <ProtectedRoute roles={["admin"]}>
                                <EditDepartment />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/admin/departments"
                        element={
                            <ProtectedRoute roles={["admin"]}>
                                <Departments />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/admin/audit-logs"
                        element={
                            <ProtectedRoute roles={["admin"]}>
                                <AuditLogs />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/employees/:id"
                        element={
                            <ProtectedRoute roles={["admin"]}>
                                <EmployeeDetails />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/admin/employees/edit/:id"
                        element={
                            <ProtectedRoute roles={["admin"]}>
                                <EditEmployee />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/admin/employees/create"
                        element={
                            <ProtectedRoute roles={["admin"]}>
                                <CreateEmployee />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/admin/employees"
                        element={
                            <ProtectedRoute roles={["admin"]}>
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
                        path="/admin/dashboard"
                        element={
                            <ProtectedRoute
                                roles={["admin"]}
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
