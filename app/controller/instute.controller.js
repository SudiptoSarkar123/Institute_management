const User = require('../model/users.model')
const Role = require('../model/role.model')
const Course = require('../model/course.model')
const { Validator } = require('node-input-validator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const path = require('path')
const fs = require('fs')

class instituteController {
    async register(req, res) {
        const v = new Validator(req.body, {
            name: 'required|string',
            email: 'required|email',
            password: 'required|string|minLength:6',
            role: 'required|string'
        });
        const matched = await v.check();
        if (!matched) {
            return res.status(422).json(v.errors);
        }
        try {
            const { name, email, password, role } = req.body;
            if (!name || !email || !password || !role) {
                return res.status(400).json({
                    message: 'All filds are required...'
                })
            }
            const ifExsist = await User.findOne({ email });
            if (ifExsist) {
                return res.status(400).json({
                    message: 'User alrady exists...'
                })
            }
            const newUser = new User({
                name, email, password, role
            });

            const data = await newUser.save()

            return res.status(400).json({
                message: `New user ${name} is created successfully `,
                newUser: data
            })

        } catch (error) {
            return res.status(400).json({
                message: 'Failed to register user...'
            })
        }
    }

    async createRoll(req, res) {
        try {
            const { name, permissions } = req.body;
            if (!name || !permissions) {
                return res.status(400).json({
                    message: `All filds are required...`
                })
            }
            const isNew = await Role.findOne({ name: name.toUpperCase() });
            if (isNew) {
                return res.status(400).json({
                    message: 'Roll alrady exists...'
                })
            }
            const newRoll = new Role({
                name: name.toUpperCase(),
                permissions
            })
            await newRoll.save()
            return res.status(200).json({
                message: `New roll created successfully`,
                data: newRoll
            })
        } catch (error) {
            console.log(error)
            return res.status(400).json({
                message: "Failed to add roll"
            })
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({
                    message: `All filds are required...`
                })
            }

            const users = await User.aggregate([
                {
                    $match: { email: email.toLowerCase() }
                },
                {
                    $lookup: {
                        from: "roles",
                        localField: "role",
                        foreignField: "_id",
                        as: "role"
                    }
                },
                {
                    $unwind: "$role"
                },
                {
                    $project: {
                        _id: 1,
                        name: 1,
                        email: 1,
                        password: 1,
                        role: "$role.name"
                    }
                }
            ]);


            if (!users || users.length === 0) {
                return res.status(400).json({
                    message: `User not found`
                })
            }
            const userData = users[0];
            const isMatch = await bcrypt.compareSync(password, userData.password);


            if (!isMatch) {
                return res.status(400).json({
                    message: `Password does not match`
                })
            }
            const payload = {
                id: userData._id,
                name: userData.name,
                email: userData.email,
                role: userData.role
            }
            const token = jwt.sign(payload, process.env.JWT_SECRET);
            // console.log(token)


            return res.status(200).json({
                message: `User logged in successfully`,
                user: userData,
                token: token
            })

        } catch (error) {
            console.log(error)
            return res.status(400).json({
                message: "Failed to login"
            })
        }
    }

    async getProfile(req, res) {
        try {
            const user = await User.findById(req.user.id).select('-password');
            if (!user) {
                return res.status(400).json({
                    message: `User not found`
                })
            }
            return res.status(200).json({
                message: `User profile`,
                user: user
            })
        } catch (error) {
            console.log(error)
            return res.status(400).json({
                message: "Failed to get profile"
            })
        }
    }

    async updateProfile(req, res) {
        try {
            const contact = req.body.phoneNo
            const user = await User.findById(req.user.id);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            user.contact = contact ? contact : '0';

            // Delete old profile picture if it exists and a new one is being uploaded
            if (req.file && user.profilePic) {
                const oldPath = path.join(__dirname, '..', '..', user.profilePic);
                if (fs.existsSync(oldPath)) {
                    try {
                        fs.unlinkSync(oldPath);
                        console.log('Old profile picture deleted:', oldPath);
                    } catch (unlinkError) {
                        console.error('Error deleting old profile picture:', unlinkError);
                    }
                }
            }

            // Update profile picture only if a new file is uploaded
            if (req.file) {
                user.profilePic = `uploads/${req.file.filename}`;
            }

            await user.save();

            return res.status(200).json({ message: 'Profile updated.' });
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: error.message });
        }
    }

    async getAllUsers(req, res) {
        try {
            const { role, search, limit = 50, page = 1 } = req.query

            let query = {}
            let roleFilter = null

            // Filter by role if provided - first get the role ID
            if (role && ['TEACHER', 'STUDENT'].includes(role.toUpperCase())) {
                const roleDoc = await Role.findOne({ name: role.toUpperCase() });
                if (roleDoc) {
                    roleFilter = roleDoc._id;
                }
            }

            // Search functionality for name and email
            if (search) {
                query.$or = [
                    { name: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } }
                ]
            }

            // Add role filter to query if we found a valid role
            if (roleFilter) {
                query.role = roleFilter;
            }

            // Pagination
            const skip = (parseInt(page) - 1) * parseInt(limit)

            // Get total count for pagination info
            const totalUsers = await User.countDocuments(query)

            // Get users with role lookup and pagination
            const users = await User.aggregate([
                { $match: query },
                {
                    $lookup: {
                        from: "roles",
                        localField: "role",
                        foreignField: "_id",
                        as: "roleDetails"
                    }
                },
                {
                    $unwind: {
                        path: "$roleDetails",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $project: {
                        _id: 1,
                        name: 1,
                        email: 1,
                        contact: 1,
                        profilePic: 1,
                        role: "$roleDetails.name",
                        permissions: "$roleDetails.permissions",
                        createdAt: 1,
                        updatedAt: 1
                    }
                },
                { $skip: skip },
                { $limit: parseInt(limit) }
            ])

            return res.status(200).json({
                users,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(totalUsers / parseInt(limit)),
                    totalUsers,
                    limit: parseInt(limit)
                }
            });

        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: error.message });
        }
    }

    async addCourse(req, res) {
        const v = new Validator(req.body, {
            title: 'required|string',
            description: 'required|string',
            durationWeeks: 'required|numeric',
            price: 'required|numeric'
        });
        const matched = await v.check();
        if (!matched) {
            return res.status(422).json(v.errors);
        }

        try {
            const { title, description,durationWeeks, price } = req.body;
            const newCourse = new Course({
                title,
                description,
                durationWeeks,
                price
            })
            const course = await newCourse.save()

            return res.status(200).json({
                message: `New course created successfully`
            })
        } catch (error) {
            console.log(error)
            return res.status(400).json({
                message: "Failed to add course"
            })
        }
    }
}


module.exports = new instituteController()