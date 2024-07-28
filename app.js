const express = require('express')   //require = all express things will come into express
const app = express()
const port = 5000
const web = require('./routes/web')   // for requiring web.js file
const run = require('reinstall-node-modules')
const connectDB = require('./db/connectDB')

// connect flash and session
const session = require('express-session')
const flash = require('connect-flash')
const fileUpload = require('express-fileupload')
const cookieParser = require('cookie-parser')

// token get cookie
app.use(cookieParser())

app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/'
}));

//messages
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
}));

// flash messages
app.use(flash());


// web.js is a common server for route

// for basic page run - 
// app.get('/', (req, res) => {    //by default page
//     res.send('Home Page')
// })

// app.get('/about', (req, res) => {   //about page
//     res.send('About Page')
// })
// basic pg run end - 

// parse application/x-www-form-urlencoded data get
app.use(express.urlencoded({ extended: false }))



// ejs is a template engine of express.js which is used for using frontend in backend 
app.set('view engine', 'ejs')

// css - image link
app.use(express.static("public"))

// connect db link
connectDB()


// route load
app.use('/', web)  //use function is used for using the routed file i.e - web.js

//server create is always in last
app.listen(port, () => console.log("server start localhost:5000")) //for starting the server