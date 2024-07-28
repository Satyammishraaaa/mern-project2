// web.js is a common server for route
// app.get is changed to route.get in this
const express = require('express')
const FrontController = require('../controllers/FrontController')
const route = express.Router()
const checkUserAuth = require('../middleware/auth')
const CourseController = require('../controllers/CourseController')
const AdminController = require('../controllers/AdminController')
const adminrole = require('../middleware/adminrole')


// route.get('/', (req, res) => {    //by default page
//     res.send('Home Page')
// })

// route.get('/about', (req, res) => {   //about page
//     res.send('About Page')
// })


// frontcontroller route && static methods are called by their names eg (.login, .register)
//  ('/') - url of the page

route.get('/', FrontController.login) //method call for login
route.get('/register', FrontController.register) //register
route.get('/home', checkUserAuth, FrontController.home) //home
route.get('/about', checkUserAuth, FrontController.about) //about
route.get('/contact', checkUserAuth, FrontController.contact) //contact
route.get('/profile', checkUserAuth, FrontController.profile) //profile
route.post('/changePassword', checkUserAuth, FrontController.changePassword) //Change-Password
route.post('/updateProfile', checkUserAuth, FrontController.updateProfile) //Update-Profile
route.post('/forgot_Password', FrontController.forgetPasswordVerify) //forgot password
route.get('/reset-password', FrontController.reset_Password) //reset password
route.post('/reset_Password1', FrontController.reset_Password1)  //reset password1 - where new password will be set
route.post('/contact_Message', FrontController.contact_Message) //contact message




// userinsert - register route
route.post('/userInsert', FrontController.userinsert)
// verifyLogin - login route
route.post('/verifyLogin', FrontController.verifyLogin)
// logout method - for logout
route.get('/logout', FrontController.logout)
// mail verify
route.get('/verify', FrontController.verifymail)



// course controller
route.post('/course_insert', checkUserAuth, CourseController.courseInsert)  // courseInsert
route.get('/courseDisplay', checkUserAuth, CourseController.courseDisplay)  // course display
route.get('/courseView/:id', checkUserAuth, CourseController.courseView)    // course view
route.get('/courseEdit/:id', checkUserAuth, CourseController.courseEdit)    // course edit
route.post('/courseUpdate/:id', checkUserAuth, CourseController.courseUpdate)    // course update
route.get('/courseDelete/:id', checkUserAuth, CourseController.courseDelete)    // course delete




// admin controller
route.get('/admin/display', checkUserAuth, adminrole('admin'), AdminController.display)
// Update Status
route.post('/admin/updateStatus/:id', checkUserAuth, adminrole('admin'), AdminController.updateStatus)
// contact admin
route.get('/adminContact', checkUserAuth, adminrole('admin'), AdminController.contact)


module.exports = route