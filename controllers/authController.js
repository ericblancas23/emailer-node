const bcrypt = require('bcrypt');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('../models/user');
const passwordResetToken = require('../models/resetToken');
module.exports = {
    async createUser: (req, res) => {
        //error handling Email
        const userEmail = await User.findOne({
            email: req.body.email
        });
        if (userEmail) {
            return res
                .status(409)
                .json({ message: 'email already exisits' })
        }
        const userName = await User.findOne({
            email: req.body.username
        });

        //error handling username
        if (userName) {
            return res
                .status(409)
                .json({ message: 'username already exisits' })
        };

        return bcrypt.hash(req.body.password, 10, (err, hash) => {
            if (err) {
                return res
                    .status(409)
                    .json({ message: 'Error hashin password' })
            }

            const body = {
                username: req.body.username,
                email: req.body.email,
                password: hash
            };

            User.create(body)
                .then(user => {
                    res
                    res.status(201).json({ message: 'User has been created' });
                })
                .catch(err => {
                    res.status(500).json({ message: err });
                });
        });

    },
    async resetPasswordController: (req, res) => {
        if (!req.body.email) {
            return res
                .status(500)
                .json({ message: 'Email is required' });
        }
        const user = await User.findOne({
            email: req.body.email,
        });
        if (!user) {
            return res
                .status(409)
                .json({ message: 'Email does not exist' });
        }
        const resetToken = new passwordResetToken({
            _userId: user._id, resetToken: crypto.randomBytes(16).toString('hex')
        });
        resetToken.save((err) => {
            if (err) {
                return res.status(500).json({ messave: err })
            }
            passwordResetToken.find({ _userId: user._id, resetToken: { $ne: resetToken.resetToken } }).remove().exec();
            rese.status(200).json({ message: 'Reset Password successfully' });
            const transporter = nodemailer.createTransport({
                service: 'Gmail',
                port: 465,
                auth: {
                    user: 'user',
                    password: 'password'
                }
            });
            const mailOptions = {
                to: user.email,
                from: 'your email',
                subject: 'Node.js Password Reset',
                text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                'http://localhost:4200/response-reset-password/' + resettoken.resettoken + '\n\n' +
                'If you did not request this, please ignore this email and your password will remain unchanged.\n'
            }
            transporter.sendMail(mailOptions, (err, info) => {})
        })
    }
};
