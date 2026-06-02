import DashboardLayout from "../../layouts/DashboardLayout";

const ManagerDashboard = () => {
    return (
        <DashboardLayout>
            <div className="mb-8">
                <h1 className="text-3xl font-bold">
                    Manager Dashboard
                </h1>

                <p className="text-gray-500">
                    Monitor and manage your team.
                </p>
            </div>
        </DashboardLayout>
    );
};

export default ManagerDashboard;