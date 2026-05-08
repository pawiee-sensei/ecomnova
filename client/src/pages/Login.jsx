import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";
import useAuthStore from "../store/authStore";

const Login = () => {

    const navigate = useNavigate();

    const setAuth = useAuthStore(
        (state) => state.setAuth
    );

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const response = await api.post(
                "/auth/login",
                formData
            );

            setAuth(response.data);

            const role = response.data.user.role;

            if (role === "admin") {
                navigate("/admin/dashboard");
            } else if (role === "manager") {
                navigate("/manager/dashboard");
            } else {
                navigate("/agent/dashboard");
            }

        } catch (error) {
            console.log(error.response.data || error.message);
            alert(error.response?.data?.message || "Login failed");
        }
    };

    return (
        <div className="h-screen flex items-center justify-center">

            <form
                onSubmit={handleSubmit}
                className="w-[350px] space-y-4"
            >

                <h1 className="text-3xl font-bold">
                    Login
                </h1>

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    onChange={handleChange}
                    className="w-full border p-3"
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    onChange={handleChange}
                    className="w-full border p-3"
                />

                <button
                    className="w-full bg-black text-white p-3"
                >
                    Login
                </button>

            </form>

        </div>
    );
};

export default Login;