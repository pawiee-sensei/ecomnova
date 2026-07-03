const notificationService = require("../services/notificationService");

const getNotifications = async (req, res) => {
    try {
        const userId = req.user.id;
        const [notifications, unreadCount] = await Promise.all([
            notificationService.getUserNotifications(userId),
            notificationService.getUnreadCount(userId),
        ]);
        res.json({ notifications, unreadCount });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to load notifications" });
    }
};

const markAsRead = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        await notificationService.markAsRead(id, userId);
        res.json({ message: "Marked as read" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to mark as read" });
    }
};

const markAllAsRead = async (req, res) => {
    try {
        const userId = req.user.id;
        await notificationService.markAllAsRead(userId);
        res.json({ message: "All marked as read" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to mark all as read" });
    }
};

module.exports = {
    getNotifications,
    markAsRead,
    markAllAsRead,
};