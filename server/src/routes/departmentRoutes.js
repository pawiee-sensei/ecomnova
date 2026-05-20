const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const {
    getDepartments,
    createDepartment
} = require("../controllers/departmentController");

router.get(
    "/",
    authMiddleware,
    roleMiddleware("admin"),
    getDepartments
);

router.post(
    "/",
    authMiddleware,
    roleMiddleware("admin"),
    createDepartment
);

module.exports = router;