const express=require('express')
const app=express()
const cors=require('cors')
const cookieParser=require('cookie-parser')
const authRouter=require('./routes/auth.router')
const postRouter=require('./routes/post.router')
const userRouter=require("./routes/user.router")
app.use(express.json())
app.use(cors(
    {
        credentials:true,
        origin:"http://localhost:5173"
    }
))
app.use(cookieParser())
app.use('/api/auth',authRouter)
app.use('/api/posts',postRouter)
app.use('/api/users',userRouter)

module.exports=app