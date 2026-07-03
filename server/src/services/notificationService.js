const notificationModel = require("../models/notificationModel");

const getUserNotifications = async (userId) => {
    return new Promise((resolve, reject) => {
        notificationModel.getUserNotifications(userId, (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};

const markAsRead = async (notificationId, userId) => {
    return new Promise((resolve, reject) => {
        notificationModel.markAsRead(notificationId, userId, (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

const markAllAsRead = async (userId) => {
    return new Promise((resolve, reject) => {
        notificationModel.markAllAsRead(userId, (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

const createNotification = async (userId, title, message, type, link) => {
    return new Promise((resolve, reject) => {
        notificationModel.createNotification(userId, title, message, type, link, (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

const getUnreadCount = async (userId) => {
    return new Promise((resolve, reject) => {
        notificationModel.getUnreadCount(userId, (err, results) => {
            if (err) return reject(err);
            resolve(results[0]?.count || 0);
        });
    });
};

module.exports = {
    getUserNotifications,
    markAsRead,
    markAllAsRead,
    createNotification,
    getUnreadCount,
};