const db = require("../config/db");

const getPermissions = (callback) => {
    const sql = `
        SELECT
            id,
            name,
            module,
            description
        FROM permissions
        ORDER BY module, name
    `;

    db.query(sql, callback);
};

const getRolePermissions = (callback) => {
    const sql = `
        SELECT
            role_permissions.role,
            permissions.name AS permission
        FROM role_permissions
        INNER JOIN permissions
            ON role_permissions.permission_id = permissions.id
        ORDER BY role_permissions.role, permissions.name
    `;

    db.query(sql, callback);
};

const getPermissionsByRole = (
    role,
    callback
) => {
    const sql = `
        SELECT
            permissions.name AS permission
        FROM role_permissions
        INNER JOIN permissions
            ON role_permissions.permission_id = permissions.id
        WHERE role_permissions.role = ?
        ORDER BY permissions.name
    `;

    db.query(sql, [role], callback);
};

const roleHasPermission = (
    role,
    permission,
    callback
) => {
    const sql = `
        SELECT
            permissions.id
        FROM role_permissions
        INNER JOIN permissions
            ON role_permissions.permission_id = permissions.id
        WHERE role_permissions.role = ?
            AND permissions.name = ?
        LIMIT 1
    `;

    db.query(
        sql,
        [role, permission],
        callback
    );
};

const replaceRolePermissions = (
    role,
    permissions,
    callback
) => {
    db.beginTransaction((transactionError) => {
        if (transactionError) {
            return callback(transactionError);
        }

        const deleteSql = `
            DELETE FROM role_permissions
            WHERE role = ?
        `;

        db.query(deleteSql, [role], (deleteError) => {
            if (deleteError) {
                return db.rollback(() =>
                    callback(deleteError)
                );
            }

            if (!permissions.length) {
                return db.commit(callback);
            }

            const insertSql = `
                INSERT INTO role_permissions (
                    role,
                    permission_id
                )
                SELECT
                    ?,
                    id
                FROM permissions
                WHERE name IN (?)
            `;

            db.query(
                insertSql,
                [role, permissions],
                (insertError, result) => {
                    if (insertError) {
                        return db.rollback(() =>
                            callback(insertError)
                        );
                    }

                    db.commit((commitError) => {
                        if (commitError) {
                            return db.rollback(() =>
                                callback(commitError)
                            );
                        }

                        callback(null, result);
                    });
                }
            );
        });
    });
};

module.exports = {
    getPermissions,
    getRolePermissions,
    getPermissionsByRole,
    roleHasPermission,
    replaceRolePermissions
};
