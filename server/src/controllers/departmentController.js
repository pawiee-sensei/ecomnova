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

module.exports = {
    getDepartments,
    createDepartment
};