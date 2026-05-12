import useAuthStore from "../store/authStore";
import LogoutButton from "./LogoutButton";

const Navbar = () => {
    const user  = useAuthStore((state) => state.user);

    return(
        <header className="h-16 border-b px-6 flex items-center justify-between">
            <h1>
                Welcome, {user?.fullname}
            </h1>

            <LogoutButton />
        </header>
    );
};

export default Navbar;