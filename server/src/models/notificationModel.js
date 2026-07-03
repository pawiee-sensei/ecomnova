const db = require("../config/db");

const getUserNotifications = (userId, callback) => {
    const sql = `
        SELECT id, title, message, type, is_read, link, created_at
        FROM notifications
        WHERE user_id = ?
        ORDER BY created_at DESC
        LIMIT 20
    `;
    db.query(sql, [userId], callback);
};

const markAsRead = (notificationId, userId, callback) => {
    const sql = `
        UPDATE notifications
        SET is_read = TRUE
        WHERE id = ? AND user_id = ?
    `;
    db.query(sql, [notificationId, userId], callback);
};

const markAllAsRead = (userId, callback) => {
    const sql = `
        UPDATE notifications
        SET is_read = TRUE
        WHERE user_id = ?
    `;
    db.query(sql, [userId], callback);
};

const createNotification = (userId, title, message, type, link, callback) => {
    const sql = `
        INSERT INTO notifications (user_id, title, message, type, link)
        VALUES (?, ?, ?, ?, ?)
    `;
    db.query(sql, [userId, title, message, type, link || null], callback);
};

const getUnreadCount = (userId, callback) => {
    const sql = `
        SELECT COUNT(*) AS count
        FROM notifications
        WHERE user_id = ? AND is_read = FALSE
    `;
    db.query(sql, [userId], callback);
};

module.exports = {
    getUserNotifications,
    markAsRead,
    markAllAsRead,
    createNotification,
    getUnreadCount,
};