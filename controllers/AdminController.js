const CourseModel = require('../models/course')
const nodemailer = require('nodemailer')
const ContactModel = require('../models/contact')

class AdminController {

    static display = async (req, res) => {
        try {
            const { name, image, email, id, role } = req.Udata
            const course = await CourseModel.find()
            const contacts = await ContactModel.find() // Fetching Contact Messages
            res.render('admin/display', { n: name, i: image, c: course, contacts: contacts, role: role, msg: req.flash('success') })

        } catch (error) {
            console.log(error)
        }
    }

    static contact = async (req, res) => {
        try {
            const { name, image, email, id, role } = req.Udata
            const course = await CourseModel.find()
            const contacts = await ContactModel.find() // Fetching Contact Messages
            res.render('admin/contact', { n: name, i: image, c: course, contacts: contacts, role: role, msg: req.flash('success') })

        } catch (error) {
            console.log(error)
        }
    }

    static updateStatus = async (req, res) => {
        try {
            // console.log(req.body)
            const { name, email, course, status, comment } = req.body
            const update = await CourseModel.findByIdAndUpdate(req.params.id, {
                status: status,
                comment: comment
            })
            this.sendEmail(name, email, course, status, comment)
            req.flash("success", "Status Updated Successfully")
            res.redirect('/admin/display')

        } catch (error) {
            console.log(error)
        }
    }

    static sendEmail = async (name, email, course, status, comment) => {
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
            subject: `${course} Course ${status}`, // Subject line
            text: "heelo", // plain text body
            html: `<b>${name}</b> ${course} Course  <b>${status}</b> successful! <br>
             <b>Comment from Admin</b> ${comment} `, // html body
        });
    }
}
module.exports = AdminController