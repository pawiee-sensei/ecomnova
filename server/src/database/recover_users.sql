-- Recovery script for the missing users table and default accounts
-- Run this in phpMyAdmin or via MySQL CLI against the ecomnova database.

USE ecomnova;

SET NAMES utf8mb4;

DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    employee_id VARCHAR(50) NULL,
    fullname VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'agent',
    department_id INT UNSIGNED NULL,
    team_id INT UNSIGNED NULL,
    manager_id INT UNSIGNED NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    security_status VARCHAR(50) NOT NULL DEFAULT 'active',
    token_version INT NOT NULL DEFAULT 0,
    job_title VARCHAR(100) NULL,
    employment_type VARCHAR(100) NULL,
    hire_date DATE NULL,
    work_location VARCHAR(100) NULL,
    shift VARCHAR(100) NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uk_users_email (email),
    KEY idx_users_role (role),
    KEY idx_users_status (status)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS security_settings (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    failed_attempt_threshold INT NOT NULL DEFAULT 5,
    failed_attempt_window_minutes INT NOT NULL DEFAULT 15,
    auto_lock_enabled TINYINT(1) NOT NULL DEFAULT 1,
    jwt_expiration INT NOT NULL DEFAULT 3600,
    password_min_length INT NOT NULL DEFAULT 8,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO security_settings (id, failed_attempt_threshold, failed_attempt_window_minutes, auto_lock_enabled, jwt_expiration, password_min_length)
VALUES (1, 5, 15, 1, 3600, 8)
ON DUPLICATE KEY UPDATE
    failed_attempt_threshold = VALUES(failed_attempt_threshold),
    failed_attempt_window_minutes = VALUES(failed_attempt_window_minutes),
    auto_lock_enabled = VALUES(auto_lock_enabled),
    jwt_expiration = VALUES(jwt_expiration),
    password_min_length = VALUES(password_min_length);

INSERT INTO users (
    employee_id,
    fullname,
    email,
    password,
    role,
    status,
    security_status,
    job_title,
    employment_type,
    work_location
)
VALUES
    ('ADM-001', 'System Administrator', 'admin@ecomnova.com', '$2b$10$fFg5SnlZHV36389nQn/0K.Gn3EdurbXW.Mib0vxQY4I6inFuVfX7G', 'admin', 'active', 'active', 'System Administrator', 'full_time', 'Head Office'),
    ('MGR-001', 'Operations Manager', 'manager@ecomnova.com', '$2b$10$vAXS2y1bRNzsMUIeRrijSep5VHfM0b53q92DUjk4GZpWbxDRFadz2', 'manager', 'active', 'active', 'Operations Manager', 'full_time', 'Head Office'),
    ('AGT-001', 'Customer Support Agent', 'agent@ecomnova.com', '$2b$10$K6IXDvB3qMrig5P/r42q1eArqT7xDohJ.a/RRhFJdf2aciO86zs6C', 'agent', 'active', 'active', 'Support Agent', 'full_time', 'Remote'),
    ('HR-001', 'HR Officer', 'hr@ecomnova.com', '$2b$10$/aq8g77RQERbQXpXqewIIOKIjso5s3fLi5Sv0X.N1KmMw4SWPoyue', 'hr', 'active', 'active', 'HR Officer', 'full_time', 'Head Office')
ON DUPLICATE KEY UPDATE
    fullname = VALUES(fullname),
    password = VALUES(password),
    role = VALUES(role),
    status = VALUES(status),
    security_status = VALUES(security_status),
    job_title = VALUES(job_title),
    employment_type = VALUES(employment_type),
    work_location = VALUES(work_location);

SELECT id, employee_id, fullname, email, role, status, security_status
FROM users
WHERE email IN ('admin@ecomnova.com', 'manager@ecomnova.com', 'agent@ecomnova.com', 'hr@ecomnova.com')
ORDER BY role;
