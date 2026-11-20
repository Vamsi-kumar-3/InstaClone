const express=require('express')
const authRouter=express.Router()
const authcontroller=require('../controllers/auth.controller')
const identifyUser=require('../middlewares/auth.middleware')
authRouter.post('/register',authcontroller.registerController)

authRouter.post('/login',authcontroller.loginController)

authRouter.get('/get-me',identifyUser,authcontroller.getMeController)



module.exports=authRouter;