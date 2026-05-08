const db = require ("../config/db");

//get current user details
const getCurrentUser = (req, res) => {
    res.status(200).json({
        user: req.user
    });
};

//update user role
const updateUserRole = (req, res) => {

    //update user role
    const {id} = req.params;
    const {role} = req.body;

    const sql = `
    UPDATE users
    SET role = ? 
    WHERE id = ?`
    ;

    //update user role in database table users by id 
    db.query(sql, [role, id], (err, result) => {

        //check for errors
        if (err) {
            console.log(err);
            res.status(500).json(err);
        //check if user role is updated
        } else {
            res.status(200).json({
                message: "User role updated"
            });
        }
    });
};

    module.exports = {
        getCurrentUser,
        updateUserRole
    };

