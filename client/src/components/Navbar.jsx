import useAuthStore from "../store/authStore";
import LogoutButton from "./LogoutButton";

const Navbar = () => {
    const user  = useAuthStore((state) => state.user);
    const initials =
        user?.fullname
            ?.split(" ")
            .map((name) => name[0])
            .join("")
            .slice(0, 2)
            .toUpperCase() || "U";

    return(
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 px-4 py-4 backdrop-blur sm:px-6 lg:px-8">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <p className="text-sm text-slate-500">
                        Welcome back
                    </p>

                    <h1 className="text-lg font-semibold text-slate-950">
                        {user?.fullname || "EcomNova User"}
                    </h1>
                </div>

                <div className="flex items-center gap-3">
                    <div className="hidden text-right sm:block">
                        <p className="text-sm font-medium capitalize text-slate-900">
                            {user?.role || "user"}
                        </p>

                        <p className="text-xs text-slate-500">
                            Active session
                        </p>
                    </div>

                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
                        {initials}
                    </div>

                    <LogoutButton />
                </div>
            </div>
        </header>
    );
};

export default Navbar;
