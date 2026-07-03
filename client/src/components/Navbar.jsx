import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import LogoutButton from "./LogoutButton";
import api from "../services/api";

const typeIcons = {
    ticket: "🎫",
    leave: "🗓️",
    default: "🔔",
};

const formatTime = (value) => {
    if (!value) return "";
    const date = new Date(value);
    return new Intl.DateTimeFormat("en-US", {
        month: "short", day: "numeric",
        hour: "2-digit", minute: "2-digit", hour12: true,
    }).format(date);
};

const Navbar = () => {
    const user = useAuthStore((state) => state.user);
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);

    const initials =
        user?.fullname
            ?.split(" ")
            .map((name) => name[0])
            .join("")
            .slice(0, 2)
            .toUpperCase() || "U";

    const fetchNotifications = async () => {
        try {
            const response = await api.get("/notifications");
            setNotifications(response.data.notifications);
            setUnreadCount(response.data.unreadCount);
        } catch (error) {
            console.error(error);
        }
    };

    const handleMarkAsRead = async (notification) => {
        try {
            if (!notification.is_read) {
                await api.put(`/notifications/${notification.id}/read`);
                setNotifications((prev) =>
                    prev.map((n) => n.id === notification.id ? { ...n, is_read: true } : n)
                );
                setUnreadCount((prev) => Math.max(0, prev - 1));
            }
            if (notification.link) {
                setShowDropdown(false);
                navigate(notification.link);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await api.put("/notifications/read-all");
            setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 px-4 py-4 backdrop-blur sm:px-6 lg:px-8">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <p className="text-sm text-slate-500">Welcome back</p>
                    <h1 className="text-lg font-semibold text-slate-950">
                        {user?.fullname || "EcomNova User"}
                    </h1>
                </div>

                <div className="flex items-center gap-3">
                    <div className="hidden text-right sm:block">
                        <p className="text-sm font-medium capitalize text-slate-900">
                            {user?.role || "user"}
                        </p>
                        <p className="text-xs text-slate-500">Active session</p>
                    </div>

                    {/* Notification Bell */}
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setShowDropdown((prev) => !prev)}
                            className="relative flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                        >
                            🔔
                            {unreadCount > 0 && (
                                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-xs font-bold text-white">
                                    {unreadCount > 9 ? "9+" : unreadCount}
                                </span>
                            )}
                        </button>

                        {/* Dropdown */}
                        {showDropdown && (
                            <div className="absolute right-0 top-12 z-50 w-80 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xl">
                                {/* Header */}
                                <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                                    <p className="text-sm font-semibold text-slate-800">
                                        Notifications
                                        {unreadCount > 0 && (
                                            <span className="ml-2 rounded-full bg-rose-100 px-2 py-0.5 text-xs font-bold text-rose-600">
                                                {unreadCount} new
                                            </span>
                                        )}
                                    </p>
                                    {unreadCount > 0 && (
                                        <button
                                            onClick={handleMarkAllAsRead}
                                            className="text-xs text-violet-600 hover:underline"
                                        >
                                            Mark all read
                                        </button>
                                    )}
                                </div>

                                {/* List */}
                                <div className="max-h-80 overflow-y-auto">
                                    {notifications.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center py-10 text-center">
                                            <p className="text-2xl">🔔</p>
                                            <p className="mt-2 text-sm text-slate-500">No notifications yet</p>
                                        </div>
                                    ) : (
                                        notifications.map((n) => (
                                            <button
                                                key={n.id}
                                                onClick={() => handleMarkAsRead(n)}
                                                className={`w-full border-b border-slate-50 px-4 py-3 text-left transition-all hover:bg-slate-50 ${!n.is_read ? "bg-violet-50/50" : ""}`}
                                            >
                                                <div className="flex items-start gap-3">
                                                    <span className="mt-0.5 text-lg shrink-0">
                                                        {typeIcons[n.type] || typeIcons.default}
                                                    </span>
                                                    <div className="min-w-0 flex-1">
                                                        <div className="flex items-center justify-between gap-2">
                                                            <p className={`text-sm font-semibold ${!n.is_read ? "text-slate-900" : "text-slate-600"}`}>
                                                                {n.title}
                                                            </p>
                                                            {!n.is_read && (
                                                                <span className="h-2 w-2 shrink-0 rounded-full bg-violet-500" />
                                                            )}
                                                        </div>
                                                        <p className="mt-0.5 text-xs text-slate-500 line-clamp-2">
                                                            {n.message}
                                                        </p>
                                                        <p className="mt-1 text-xs text-slate-400">
                                                            {formatTime(n.created_at)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </button>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
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