import { create } from "zustand";

const useAuthStore = create((set) => ({

    // Stores logged-in user data.
    user: null,
    // check if token exists
    token: localStorage.getItem("token") || null,

    loading: true,

    //runs when user logs in
    setAuth: (data) => {

        // save token to local storage
        localStorage.setItem("token", data.token);

        // update state with user data
        set({
            user: data.user,
            token: data.token
        });
    },

    setUser : (user) => {
        set({
            user,
            loading: false
        });
    },

    stopLoading: () => {
        set({
            loading: false
        });
    },

    logout: () => {

        //Removes token from local storage
        localStorage.removeItem("token");

        //Clears auth state.
        set({
            user: null,
            token: null,
            loading: false
        });
    }
}));

export default useAuthStore;