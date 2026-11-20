const express=require("express")
const userController=require("../controllers/user.controller")
const userRouter=express.Router()
const identifyUser=require("../middlewares/auth.middleware")

userRouter.post('/follow/:username',identifyUser,userController.followUserController);
userRouter.post("/unfollow/:username",identifyUser,userController.unfollowUserController)
userRouter.get("/follow/requests",identifyUser,userController.getFollowRequestsController)
userRouter.patch("/follow/:followId/accept",identifyUser,userController.acceptFollowRequestController)
userRouter.patch("/follow/:followId/reject",identifyUser,userController.acceptFollowRequestController)

module.exports=userRouter