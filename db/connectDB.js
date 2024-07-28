// db database connectivity is done by mongoose - mongoDB
// it gives promise function

const mongoose = require('mongoose');
const local_URL = 'mongodb://localhost:27017/Practice_Admission_Portal'
const liveUrl ='mongodb+srv://satyammishra:satyam123@cluster0.enkf8vu.mongodb.net/admissionPortalad?retryWrites=true&w=majority&appName=Cluster0'



const connectDB = () => {
    return mongoose.connect(liveUrl)
        .then(() => {
            console.log("Connect Successfully")
        }).catch((error) => {
            console.log(error)
        })
}
module.exports = connectDB