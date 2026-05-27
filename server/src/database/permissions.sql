CREATE TABLE IF NOT EXISTS permissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    module VARCHAR(100) NOT NULL,
    description VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS role_permissions (
    role VARCHAR(50) NOT NULL,
    permission_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (role, permission_id),
    CONSTRAINT fk_role_permissions_permission
        FOREIGN KEY (permission_id)
        REFERENCES permissions(id)
        ON DELETE CASCADE
);

INSERT IGNORE INTO permissions (name, module, description) VALUES
    ('VIEW_PERMISSIONS', 'ACCESS_CONTROL', 'View role permission matrix'),
    ('MANAGE_PERMISSIONS', 'ACCESS_CONTROL', 'Update role permission assignments'),
    ('VIEW_SYSTEM_USERS', 'ACCESS_CONTROL', 'View system users'),
    ('MANAGE_USER_ROLES', 'ACCESS_CONTROL', 'Change user roles'),
    ('LOCK_ACCOUNT', 'SECURITY', 'Lock or unlock user accounts'),
    ('FORCE_LOGOUT', 'SECURITY', 'Revoke active user sessions'),
    ('VIEW_AUDIT_LOGS', 'SECURITY', 'View audit logs'),
    ('VIEW_LOGIN_MONITORING', 'SECURITY', 'View login monitoring'),
    ('VIEW_HR_DASHBOARD', 'WORKFORCE', 'View HR dashboard statistics'),
    ('VIEW_EMPLOYEES', 'WORKFORCE', 'View employee records'),
    ('CREATE_EMPLOYEES', 'WORKFORCE', 'Create employee records'),
    ('EDIT_EMPLOYEES', 'WORKFORCE', 'Edit employee records'),
    ('TERMINATE_EMPLOYEE', 'WORKFORCE', 'Terminate or change employment status'),
    ('RESET_EMPLOYEE_PASSWORD', 'WORKFORCE', 'Reset employee passwords'),
    ('VIEW_DEPARTMENTS', 'WORKFORCE', 'View departments'),
    ('MANAGE_DEPARTMENTS', 'WORKFORCE', 'Create or update departments'),
    ('VIEW_TEAMS', 'WORKFORCE', 'View teams'),
    ('MANAGE_TEAMS', 'WORKFORCE', 'Create or update teams');

INSERT IGNORE INTO role_permissions (role, permission_id)
SELECT 'super_admin', id FROM permissions;

INSERT IGNORE INTO role_permissions (role, permission_id)
SELECT 'admin', id FROM permissions
WHERE name IN (
    'VIEW_PERMISSIONS',
    'MANAGE_PERMISSIONS',
    'VIEW_SYSTEM_USERS',
    'MANAGE_USER_ROLES',
    'LOCK_ACCOUNT',
    'FORCE_LOGOUT',
    'VIEW_AUDIT_LOGS',
    'VIEW_LOGIN_MONITORING'
);

INSERT IGNORE INTO role_permissions (role, permission_id)
SELECT 'hr', id FROM permissions
WHERE name IN (
    'VIEW_HR_DASHBOARD',
    'VIEW_EMPLOYEES',
    'CREATE_EMPLOYEES',
    'EDIT_EMPLOYEES',
    'TERMINATE_EMPLOYEE',
    'RESET_EMPLOYEE_PASSWORD',
    'VIEW_DEPARTMENTS',
    'MANAGE_DEPARTMENTS',
    'VIEW_TEAMS',
    'MANAGE_TEAMS'
);

INSERT IGNORE INTO role_permissions (role, permission_id)
SELECT 'manager', id FROM permissions
WHERE name IN (
    'VIEW_EMPLOYEES',
    'VIEW_DEPARTMENTS',
    'VIEW_TEAMS'
);

INSERT IGNORE INTO role_permissions (role, permission_id)
SELECT 'leader', id FROM permissions
WHERE name IN (
    'VIEW_TEAMS'
);
