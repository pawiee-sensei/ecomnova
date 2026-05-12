import Sidebar from "../components/Sidebar";

import Navbar from "../components/Navbar";

const DashboardLayout = ({ children }) => {
    return (
        <div className="flex min-h-screen">

            <Sidebar />

            <div className="flex-1 flex flex-col">
                <Navbar />

                <main className="p-6">
                    {children}
                </main>

            </div>

        </div>
    );
};

export default DashboardLayout;