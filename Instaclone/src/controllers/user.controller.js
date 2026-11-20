const followModel=require("../models/follow.model")
const userModel=require("../models/user.model")
async function followUserController(req,res){
   
   // Person who is sending the follow request
    const followerUsername=req.user.username

     // Person whom we want to follow
    const followeeUsername=req.params.username

      // ----------------------------------------------
        // 1. Cannot follow yourself
        // ----------------------------------------------
    if(followeeUsername==followerUsername){
        return res.status(400).json({
            message:"You cant follow yourself"
        })
    }
    


        // ----------------------------------------------
        // 2. Check whether followee exists
        // ----------------------------------------------
const isFolloweeExists=await userModel.findOne({username:followeeUsername})
 if (!isFolloweeExists) {
        return res.status(404).json({
            message: "User you are trying to follow does not exist"
        })
    }



        // ----------------------------------------------
        // 3. Check existing follow record
        // ----------------------------------------------
const isAlreadyFollowing=await followModel.findOne({
        follower:followerUsername,
        followee:followeeUsername
    })

            // ----------------------------------------------
        // 4. If already exists
        // ----------------------------------------------
    if (isAlreadyFollowing) {
        if(isAlreadyFollowing.status==="accepted"){
    return res.status(200).json({
        message:`You are already following ${followeeUsername}`,
        follow:isAlreadyFollowing
    })
} 
    // Request is already pending
            if (isAlreadyFollowing.status === "pending") {

                return res.status(200).json({
                    message: `Follow request already sent to ${followeeUsername}`,
                    follow: isAlreadyFollowing
                });

            }


            // Previously rejected
            if (isAlreadyFollowing.status === "rejected") {

                isAlreadyFollowing.status = "pending";

                await isAlreadyFollowing.save();

                return res.status(200).json({
                    message: `Follow request sent again to ${followeeUsername}`,
                    follow: isAlreadyFollowing
                });
            

            }
        }
    const followRecord=await followModel.create({
        follower:followerUsername,
        followee:followeeUsername
    })
    res.status(201).json({
        message:`You are now following ${followeeUsername}`,
        follow:followRecord
    })
}
async function getFollowRequestsController(req,res){
    // Current logged-in user
        const username = req.user.username;


        // Find requests where current user is the followee
        // and request is still pending

        const requests = await followModel.find({
            followee: username,
            status: "pending"
        });


        return res.status(200).json({
            message: "Follow requests fetched successfully",
            requests
        });


    } 

async function acceptFollowRequestController(req,res){
    const followId = req.params.followId;

        // Person who received the request
        const followeeUsername = req.user.username;


        // Find the request
        const followRecord = await followModel.findOne({
            _id: followId,
            followee: followeeUsername,
            status: "pending"
        });


        // Request not found
        if (!followRecord) {

            return res.status(404).json({
                message: "Follow request not found"
            });

        }


        // Change pending → accepted
        followRecord.status = "accepted";

        await followRecord.save();


        return res.status(200).json({
            message: `You accepted ${followRecord.follower}'s follow request`,
            follow: followRecord
        });

    
}

async function rejectFollowRequestController(req, res) {

 

        const followId = req.params.followId;

        // Person who received the request
        const followeeUsername = req.user.username;


        // Find pending request
        const followRecord = await followModel.findOne({
            _id: followId,
            followee: followeeUsername,
            status: "pending"
        });


        if (!followRecord) {

            return res.status(404).json({
                message: "Follow request not found"
            });

        }


        // Change pending → rejected
        followRecord.status = "rejected";

        await followRecord.save();


        return res.status(200).json({
            message: `You rejected ${followRecord.follower}'s follow request`,
            follow: followRecord
        });

    } 

async function unfollowUserController(req,res){
    const followerUsername=req.user.username
    const followeeUsername=req.params.username
   const isUserFollowing= await followModel.findOne({
        follower:followerUsername,
      followee:followeeUsername,
      status: "accepted"
    })
    if(!isUserFollowing){
        return res.status(200).json({
            message: `You are not following ${followeeUsername}`
        })
    }
    await followModel.findByIdAndDelete({_id:isUserFollowing._id})
    res.status(200).json({
        message: `You have unfollowed ${followeeUsername}`
    })
}

module.exports={followUserController,getFollowRequestsController,rejectFollowRequestController,acceptFollowRequestController,unfollowUserController}