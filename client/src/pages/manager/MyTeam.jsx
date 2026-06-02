import DashboardLayout from "../../layouts/DashboardLayout";

const MyTeam = () => {
    return (
        <DashboardLayout>
            <div className="mb-8">
                <h1 className="text-3xl font-bold">
                    My Team
                </h1>

                <p className="text-gray-500">
                    View employees assigned to you.
                </p>
            </div>
        </DashboardLayout>
    );
};

export default MyTeam;