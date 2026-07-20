import express from "express"
import "dotenv/config"
import userRouter from "./router/user.router.js"

const app = express()
const port = process.env.SERVER_PORT || 3001

app.use(express.json())
app.use("/user", userRouter)

app.listen(port, ()=>{
    console.log(`Server is listening at the port: ${port}`);
    
})