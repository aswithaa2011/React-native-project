import mongoose from "mongoose";


const connectDb=async()=>{


    try{
        const conn= await mongoose.connect(process.env.MONGO_URI)
        console.log(`Db connected ${conn.connection.host}` );
        

    }
    catch(error){


        console.log(error,"error occured");
        process.exit(0)
        
    }
}

export default connectDb;