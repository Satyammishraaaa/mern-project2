const CourseModel = require('../models/course')
const nodemailer = require('nodemailer')
const ContactModel = require('../models/contact')


class CourseController {

    static courseInsert = async (req, res) => {
        try {
            // console.log(req.body) //user input data
            const { name, email, phone, dob, address, gender, education, course } = req.body
            const result = new CourseModel({
                name: name,
                email: email,
                phone: phone,
                dob: dob,
                address: address,
                gender: gender,
                education: education,
                course: course,
                user_id: req.Udata.id,
            })
            await result.save()
            this.sendEmail(name, email, course)
            res.redirect('/courseDisplay')

        }
        catch (error) {
            console.log(error)
        }
    }

    static courseDisplay = async (req, res) => {
        try {
            const { name, image, email, id, role } = req.Udata
            const course = await CourseModel.find({ user_id: id })
            const contacts = await ContactModel.find() // Fetching Contact Messages

            // console.log(course)
            res.render('course/display', { n: name, i: image, c: course, contacts: contacts, role: role })

        }
        catch (error) {
            console.log(error)
        }
    }

    static courseView = async (req, res) => {
        try {
            const { name, image, email, id, role } = req.Udata
            const courseview = await CourseModel.findById(req.params.id)
            // console.log(courseview)
            res.render('course/view', { n: name, i: image, c: courseview, role: role })

        }
        catch (error) {
            console.log(error)
        }
    }

    static courseEdit = async (req, res) => {
        try {
            const { name, image, email, id, role } = req.Udata
            const courseview = await CourseModel.findById(req.params.id)
            // console.log(courseedit)
            res.render('course/edit', { n: name, i: image, e: email, c: courseview, role: role })

        }
        catch (error) {
            console.log(error)
        }
    }

    static courseUpdate = async (req, res) => {
        try {
            const { name, email, phone, dob, address, gender, education, course } = req.body
            const courseview = await CourseModel.findByIdAndUpdate(req.params.id, {
                name: name,
                email: email,
                phone: phone,
                dob: dob,
                address: address,
                gender: gender,
                education: education,
                course: course,
            })
            res.redirect('/courseDisplay')

        }
        catch (error) {
            console.log(error)
        }
    }

    static courseDelete = async (req, res) => {
        try {
            const { name, image, id } = req.Udata
            await CourseModel.findByIdAndDelete(req.params.id)
            res.redirect('/courseDisplay')

        }
        catch (error) {
            console.log(error)
        }
    }

    static sendEmail = async (name, email, course) => {
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
            subject: ` Course Insert`, // Subject line
            text: "hello", // plain text body
            html: `<b>${name}</b>  <b>${course}</b> Course Successful Insert! <br>
            `, // html body
        });
    }
}
module.exports = CourseController