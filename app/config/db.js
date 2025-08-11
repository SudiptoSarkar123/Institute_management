const mongoose = require('mongoose');


const dbcon = async () =>{
    try {
        const databaseConnection = await mongoose.connect(process.env.MONGO_URI)
        console.log(`Database connected to ${databaseConnection.connection.host}`)
    } catch (error) {
        console.log(error)
    }
}

module.exports = dbcon