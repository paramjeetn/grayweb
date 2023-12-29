import mongoose from "mongoose";


const UserSchema = new mongoose.Schema(

    {  
        userId:{
        type: String,
         },
        name:{
            type: String,
            required: true,
        },
        desc: {
            type: String,
            required: true,
        },
        img: {
            type: String,
            
        },        
        creationDate:{
            type:Date,
        }


    }


);

const Post = mongoose.model("Post", UserSchema);
export default Post;
