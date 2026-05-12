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

import AuthLoader from "./components/AuthLoader";
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {

    return (
        <BrowserRouter>

            <AuthLoader />
                <Routes>

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