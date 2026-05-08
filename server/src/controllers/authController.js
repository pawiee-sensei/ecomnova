const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const {createUser, findUserByEmail} = require("../models/authModel");

const register = async (req, res) => {
    try {
        const { fullname, email, password } = req.body;

        findUserByEmail(email, async (err, result) => {

            if (result.length > 0) {
                return res.status(400).json({
                    message: "Email already exists"
                });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            createUser(
                fullname,
                email,
                hashedPassword,
                (err, result) => {

                    if (err) {
                        return res.status(500).json(err);
                    }

                    res.status(201).json({
                        message: "User registered"
                    });
                }
            );
        });

    } catch (error) {
        res.status(500).json(error);
    }
};

const login = (req, res) => {

    const { email, password } = req.body;

    findUserByEmail(email, async (err, result) => {

        if (result.length === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const user = result[0];

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid credentials"
            });
        }

        const token = jwt.sign(
            {
                id: user.id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        res.json({
            token,
            user: {
                id: user.id,
                fullname: user.fullname,
                email: user.email,
                role: user.role
            }
        });
    });
};

module.exports = {
    register,
    login
};