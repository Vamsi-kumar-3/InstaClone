const mongoose=require("mongoose")

const userSchema=new mongoose.Schema({
    username:{
        type:String,
        unique:[true,"The user name already exists"],
        required:[true,"The Username is required"]

    },
    email:{
        type:String,
        unique:[true,"The user email already exists"],
        required:[true,"the email is required"]

    },password:{
        type:String,
        required:[true,"The password is required"],
        select:false

    },
    bio:String,
    profileImage:{
        type:String,
        default:"https://ik.imagekit.io/2u0swjpjfy/default.jpg"
    }

})
const userModel=mongoose.model("user",userSchema)

module.exports=userModel;