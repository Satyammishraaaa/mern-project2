const UserModel = require('../models/user')
const TeacherModel = require('../models/teacher')
const bcrypt = require('bcrypt')
const cloudinary = require('cloudinary')
const jwt = require('jsonwebtoken')
const CourseModel = require('../models/course')
const nodemailer = require('nodemailer')
const randomstring = require('randomstring')
const ContactModel = require('../models/contact')


// Configuration
cloudinary.config({
    cloud_name: "dwhu0gj91",
    api_key: "129335176667175",
    api_secret: "a6_UH_UZjeoMLjcSKfFOJHQn66g" // Click 'View Credentials' below to copy your API secret
});

// function - methods 
class FrontController {

    static login = async (req, res) => {
        try {
            res.render("login", { message: req.flash('success'), msg: req.flash('error') })

        } catch (error) {
            console.log(error)
        }
    }
    static register = async (req, res) => {
        try {
            res.render("register", { msg: req.flash('error'), msg1: req.flash('success') })
        }
        catch (error) {
            console.log(error)
        }
    }
    static home = async (req, res) => {
        try {
            const { name, image, email, id, role } = req.Udata
            const btech = await CourseModel.findOne({ user_id: id, course: "btech" })
            const bca = await CourseModel.findOne({ user_id: id, course: "bca" })
            const barch = await CourseModel.findOne({ user_id: id, course: "barch" })
            const mtech = await CourseModel.findOne({ user_id: id, course: "mtech" })
            const mca = await CourseModel.findOne({ user_id: id, course: "mca" })
            const mba = await CourseModel.findOne({ user_id: id, course: "mba" })
            // console.log(name)
            res.render("home", { n: name, i: image, e: email, btech: btech, bca: bca, barch: barch, mtech: mtech, mca: mca, mba: mba, role: role })
        }
        catch (error) {
            console.log(error)
        }
    }
    static about = async (req, res) => {
        try {
            const { name, image, role } = req.Udata
            res.render("about", { n: name, i: image, role: role })
        }
        catch (error) {
            console.log(error)
        }
    }
    static contact = async (req, res) => {
        try {
            const { name, image, role } = req.Udata
            res.render("contact", { n: name, i: image, role: role })
        }
        catch (error) {
            console.log(error)
        }
    }
    //user insert
    static userinsert = async (req, res) => {
        try {
            const file = req.files.image
            const imageUpload = await cloudinary.uploader.upload(file.tempFilePath, {
                folder: "userimage"
            })
            // console.log(imageUpload)
            // console.log(req.files.image)
            //console.log("insert data")
            const { n, e, p, cp } = req.body
            const user = await UserModel.findOne({ email: e })
            // //console.log(user)
            if (user) {
                req.flash('error', 'email already exists')
                res.redirect('/register')
            } else {
                if (n && e && p && cp) {
                    if (p == cp) {
                        const hashpassword = await bcrypt.hash(p, 10)
                        const result = new UserModel({
                            name: n,
                            email: e,
                            password: hashpassword,
                            image: {
                                public_id: imageUpload.public_id,
                                url: imageUpload.secure_url
                            }
                        })
                        const userdata = await result.save()
                        // console.log(userdata)
                        if (userdata) {
                            const token = jwt.sign({ ID: userdata._id }, "pninfosys123")
                            // console.log(token)
                            res.cookie("token", token)
                            this.sendVerifymail(n, e, userdata._id)
                            // to redirect to login page
                            req.flash("success", "You are successfully registered. Please verify your email.")
                            res.redirect('/register')
                        } else {
                            req.flash("error", "Not Register")
                            res.redirect('/register')
                        }

                    } else {
                        req.flash('error', 'All fields are required')
                        res.redirect('/register')
                    }
                }
            }

            //await result.save()
            //res.redirect('/') //route path.
        } catch (error) {
            console.log(error)
        }
    }
    // verifyLogin user
    static verifyLogin = async (req, res) => {
        try {
            // console.log(req.body)
            const { email, password } = req.body
            const user = await UserModel.findOne({ email: email })
            if (user) {
                const isMatch = await bcrypt.compare(password, user.password)
                // console.log(isMatch)

                if (isMatch) {
                    // token
                    // multiple login i.e- Admin and Student
                    if (user.role == "admin" && user.is_verified == 1) {
                        const token = jwt.sign({ ID: user._id }, 'pninfosys123');
                        // console.log(token)
                        res.cookie('token', token)
                        res.redirect('/home')
                    } else if (user.role == "student" && user.is_verified == 1) {
                        const token = jwt.sign({ ID: user._id }, 'pninfosys123');
                        // console.log(token)
                        res.cookie('token', token)
                        res.redirect('/home')
                    }
                    else {
                        req.flash("error", "Please verify your email.")
                        res.redirect('/')
                    }

                } else {
                    req.flash("error", "Email or Password not match")
                    res.redirect('/')
                }

            } else {
                req.flash("error", "You are not Register User! Plz Register")
                res.redirect('/')
            }

        } catch (error) {
            console.log(error)
        }
    }
    // profile
    static profile = async (req, res) => {
        try {
            const { name, image, email, role } = req.Udata
            res.render("profile", { n: name, i: image, e: email, role: role })
        }
        catch (error) {
            console.log(error)
        }
    }
    // logout 
    static logout = async (req, res) => {
        try {
            res.clearCookie('token')
            res.redirect('/')

        } catch (error) {
            console.log(error)
        }
    }
    // change password
    static changePassword = async (req, res) => {
        try {
            const { id } = req.Udata;
            //console.log(req.body)
            const { op, np, cp } = req.body;
            if (op && np && cp) {
                const user = await UserModel.findById(id);
                const isMatched = await bcrypt.compare(op, user.password);
                //console.log(isMatched)
                if (!isMatched) {
                    req.flash("error", "Current password is incorrect ");
                    res.redirect("/profile");
                } else {
                    if (np != cp) {
                        req.flash("error", "Password does not match")
                        res.redirect("/profile")
                    } else {
                        const newHashPassword = await bcrypt.hash(np, 10);
                        await UserModel.findByIdAndUpdate(id, {
                            password: newHashPassword,
                        });
                        req.flash("success", "Password Updated successfully ");
                        res.redirect("/");
                    }
                }
            } else {
                req.flash("error", "ALL fields are required ");
                res.redirect("/profile");
            }
        } catch (error) {
            console.log(error);
        }
    };

    static updateProfile = async (req, res) => {
        try {
            const { id } = req.Udata;
            const { name, email } = req.body;
            if (req.files) {
                const user = await UserModel.findById(id);
                const imageID = user.image.public_id;
                // console.log(imageID);

                //deleting image from Cloudinary
                await cloudinary.uploader.destroy(imageID);
                //new image update
                const imagefile = req.files.image;
                const imageupload = await cloudinary.uploader.upload(
                    imagefile.tempFilePath,
                    {
                        folder: "userprofile",
                    }
                );
                var data = {
                    name: name,
                    email: email,
                    image: {
                        public_id: imageupload.public_id,
                        url: imageupload.secure_url,
                    },
                };
            } else {
                var data = {
                    name: name,
                    email: email,
                };
            }
            await UserModel.findByIdAndUpdate(id, data);
            req.flash("success", "Update Profile successfully");
            res.redirect("/profile");
        } catch (error) {
            console.log(error);
        }
    };

    static sendVerifymail = async (name, email, user_id) => {
        // console.log(name,email,status,comment)
        // connenct with the smtp server

        let transporter = await nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,

            auth: {
                user: "Satyammishra99266@gmail.com",
                pass: "fphohvtnnwjnqigw",
            },
        });
        let info = await transporter.sendMail({
            from: "test@gmail.com", // sender address
            to: email, // list of receivers
            subject: "For Verification mail", // Subject line
            text: "heelo", // plain text body
            html:
                "<p>Hii " +
                name +
                ',Please click here to <a href="http://localhost:5000/verify?id=' +
                user_id +
                '">Verify</a>Your mail</p>.',
        });
        //console.log(info);
    };

    static verifymail = async (req, res) => {
        try {
            await UserModel.findByIdAndUpdate(req.query.id, {
                is_verified: 1
            })
            res.redirect('/')

        } catch (error) {
            console.log(error)
        }
    }

    static forgetPasswordVerify = async (req, res) => {
        try {
            const { email } = req.body;
            const userData = await UserModel.findOne({ email: email });
            //console.log(userData)
            if (userData) {
                const randomString = randomstring.generate();
                await UserModel.updateOne(
                    { email: email },
                    { $set: { token: randomString } }
                );
                this.sendEmail(userData.name, userData.email, randomString);
                req.flash("success", "Please check your email to reset your password!");
                res.redirect("/");
            } else {
                req.flash("error", "Email not found!");
                res.redirect("/");
            }
        } catch (error) {
            console.log(error);
        }
    };

    static sendEmail = async (name, email, token) => {
        // console.log(name,email,status,comment)
        // connenct with the smtp server

        let transporter = await nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,

            auth: {
                user: "Satyammishra99266@gmail.com",
                pass: "fphohvtnnwjnqigw",
            },
        });
        let info = await transporter.sendMail({
            from: "test@gmail.com", // sender address
            to: email, // list of receivers
            subject: "Reset Password", // Subject line
            text: "heelo", // plain text body
            html:
                "<p>Hii " +
                name +
                ', Please click here to <a href="http://localhost:5000/reset-password?token=' +
                token +
                '"> Reset </a> Your Password.',
        });
    };

    static reset_Password = async (req, res) => {
        try {
            const token = req.query.token;
            const tokenData = await UserModel.findOne({ token: token });
            if (tokenData) {
                res.render("reset-password", { user_id: tokenData._id });
            } else {
                res.render("404");
            }
        } catch (error) {
            console.log(error);
        }
    };

    static reset_Password1 = async (req, res) => {
        try {
            const { password, user_id } = req.body;
            const newHashPassword = await bcrypt.hash(password, 10);
            await UserModel.findByIdAndUpdate(user_id, {
                password: newHashPassword,
                token: "",
            });
            req.flash("success", "Reset Password Updated successfully ");
            res.redirect("/");
        } catch (error) {
            console.log(error);
        }
    };

    static contact_Message = async (req, res) => {
        try {
            // console.log(req.body)
            const { name, email, message } = req.body
            const result = new ContactModel({
                name: name,
                email: email,
                message: message,
            })
            await result.save()
            res.redirect('/contact')
        }
        catch (error) {
            console.log(error)
        }
    }

}

module.exports = FrontController