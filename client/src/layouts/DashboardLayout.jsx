import Sidebar from "../components/Sidebar";

import Navbar from "../components/Navbar";

const DashboardLayout = ({ children }) => {
    return (
        <div className="flex min-h-screen bg-slate-50 text-slate-900">

            <Sidebar />

            <div className="flex-1 flex min-w-0 flex-col">
                <Navbar />

                <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
                    <div className="mx-auto w-full max-w-7xl">
                        {children}
                    </div>
                </main>

            </div>

        </div>
    );
};

export default DashboardLayout;
