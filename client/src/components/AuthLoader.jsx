import { useEffect } from "react";

import api from "../services/api";

import useAuthStore from "../store/authStore";

const AuthLoader = () => {

    // Zustand store methods
    const token = useAuthStore(
        (state) => state.token
    );

    const setUser = useAuthStore(
        (state) => state.setUser
    );

    const logout = useAuthStore(
        (state) => state.logout
    );

    const stopLoading = useAuthStore(
        (state) => state.stopLoading
    );

    useEffect(() => {

        // Fetch current user if token exists
        const fetchUser = async () => {

            if (!token) {
                stopLoading();
                return;
            }

            try {

                const response = await api.get(
                    "/users/me"
                );

                // Restore authenticated user
                setUser(response.data.user);

            } catch (error) {

                // Invalid token -> logout
                logout();
            }
        };

        fetchUser();

    }, []);

    return null;
};

export default AuthLoader;