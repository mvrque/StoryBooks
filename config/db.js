const mongoose = require('mongoose')

//working with promises in mongoose
const connectDB = async ( ) => {
    try {
        mongoose.set("strictQuery", false);
        const conn= await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,  //allow user to fall back to the old parser if they find a bug
            useUnifiedTopology: true,  //mongoDB drivers new connection management engine
            
        }) 

        console.log(`MongoDB connected: ${conn.connection.host}`)
    }catch (err) {
        console.log(err)
        process.exit(1)
    }
}

module.exports = connectDB