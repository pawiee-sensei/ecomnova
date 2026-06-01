import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../services/api";

const SecuritySettings = () => {
    const [settings, setSettings] =
        useState({
            failed_attempt_threshold: 5,
            failed_attempt_window_minutes: 15,
            auto_lock_enabled: true,
            jwt_expiration: "7d",
            password_min_length: 8
        });

    const fetchSettings = async () => {
        try {
            const response =
                await api.get(
                    "/system/security-settings"
                );

            setSettings(
                response.data
            );

        } catch (error) {
            console.error(
                "Failed to fetch security settings:",
                error
            );
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    const handleChange = (e) => {
        const {
            name,
            value,
            type,
            checked
        } = e.target;

        setSettings((prev) => ({
            ...prev,
            [name]:
                type === "checkbox"
                    ? checked
                    : value
        }));
    };

    const handleSave = async () => {
        try {
            await api.put(
                "/system/security-settings",
                settings
            );

            alert(
                "Security settings updated successfully"
            );

        } catch (error) {
            console.error(
                "Update failed:",
                error
            );
        }
    };

    return (
        <DashboardLayout>
            <div className="max-w-3xl">
                <h1 className="text-3xl font-bold mb-2">
                    Security Settings
                </h1>

                <p className="text-gray-500 mb-8">
                    Configure authentication
                    and security policies
                </p>

                <div className="space-y-6">

                    <div>
                        <label className="block mb-2 font-medium">
                            Failed Attempt Threshold
                        </label>

                        <input
                            type="number"
                            name="failed_attempt_threshold"
                            value={
                                settings.failed_attempt_threshold
                            }
                            onChange={handleChange}
                            className="border p-3 rounded-lg w-full"
                        />
                    </div>

                    <div>
                        <label className="block mb-2 font-medium">
                            Failed Attempt Window (minutes)
                        </label>

                        <input
                            type="number"
                            name="failed_attempt_window_minutes"
                            value={
                                settings.failed_attempt_window_minutes
                            }
                            onChange={handleChange}
                            className="border p-3 rounded-lg w-full"
                        />
                    </div>

                    <div>
                        <label className="block mb-2 font-medium">
                            JWT Session Expiration
                        </label>

                        <select
                            name="jwt_expiration"
                            value={
                                settings.jwt_expiration
                            }
                            onChange={handleChange}
                            className="border p-3 rounded-lg w-full"
                        >
                            <option value="1h">
                                1 Hour
                            </option>

                            <option value="8h">
                                8 Hours
                            </option>

                            <option value="1d">
                                1 Day
                            </option>

                            <option value="7d">
                                7 Days
                            </option>
                        </select>
                    </div>

                    <div>
                        <label className="block mb-2 font-medium">
                            Minimum Password Length
                        </label>

                        <input
                            type="number"
                            name="password_min_length"
                            value={
                                settings.password_min_length
                            }
                            onChange={handleChange}
                            className="border p-3 rounded-lg w-full"
                        />
                    </div>

                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            name="auto_lock_enabled"
                            checked={
                                settings.auto_lock_enabled
                            }
                            onChange={handleChange}
                        />

                        <label className="font-medium">
                            Enable Automatic Account Lock
                        </label>
                    </div>

                    <button
                        onClick={handleSave}
                        className="bg-black text-white px-6 py-3 rounded-lg"
                    >
                        Save Settings
                    </button>

                </div>
            </div>
        </DashboardLayout>
    );
};

export default SecuritySettings;