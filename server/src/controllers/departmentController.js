const departmentService = require(
    "../services/departmentService"
);

/*
  Department directory
*/

const getDepartments = async (
    req,
    res
) => {
    try {
        const departments =
            await departmentService.getDepartments();

        res.status(200).json(departments);

    } catch (error) {
        res.status(500).json({
            message:
                "Failed to fetch departments"
        });
    }
};

/*
  Create department
*/

const createDepartment = async (
    req,
    res
) => {
    try {
        const {
            name,
            code,
            description,
            head_id,
            status
        } = req.body;

        await departmentService.createDepartment({
            name,
            code,
            description,
            head_id,
            status
        });

        res.status(201).json({
            message:
                "Department created successfully"
        });

    } catch (error) {
        res.status(500).json({
            message:
                "Department creation failed"
        });
    }
};

const getDepartmentById = async (
    req,
    res
) => {
    try {
        const department =
            await departmentService.getDepartmentById(
                req.params.id
            );

        res.status(200).json(department);

    } catch (error) {
        res.status(500).json({
            message:
                "Department fetch failed"
        });
    }
};

const updateDepartment = async (
    req,
    res
) => {
    try {
        await departmentService.updateDepartment(
            req.params.id,
            req.body
        );

        res.status(200).json({
            message:
                "Department updated successfully"
        });

    } catch (error) {
        res.status(500).json({
            message:
                "Department update failed"
        });
    }
};

const getDepartmentHeads = async (
    req,
    res
) => {
    try {
        const heads =
            await departmentService.getDepartmentHeads();

        res.status(200).json(heads);

    } catch (error) {
        res.status(500).json({
            message:
                "Failed to fetch department heads"
        });
    }
};

module.exports = {
    getDepartments,
    createDepartment,
    getDepartmentById,
    updateDepartment,
    getDepartmentHeads
};