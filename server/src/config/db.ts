// importing libraries
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({     // configure dotenv
    path: "../../.env"  // set path of env
});
const connectDB = async () => {

    try {
        // connecting with the Database through atlas via mongoose.connect() method
        console.log(`${process.env.MONGODB_URI}`)
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}`);
        console.log(`\n MongoDB connected !! DB Host: ${connectionInstance.connection.host}`);
    } catch (error) {
        // Error Handling
        console.error("MongoDB Connection Error:  ", error);
        process.exit(1);
    }
}


export default connectDB;