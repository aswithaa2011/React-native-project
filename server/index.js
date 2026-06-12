import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import connectDb from "./config/db.js"



dotenv.config()

const app=express()

connectDb()

app.use(cors())
app.use(express.json())




const port =process.env.PORT || 3000


app.listen(port,()=>{


    console.log(`server connected http://localhost:${port}` );


    
})

