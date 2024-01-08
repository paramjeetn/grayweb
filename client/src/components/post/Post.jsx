import "./post.scss";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Link } from "react-router-dom";
import Comments from "../comments/Comments";
import { useContext, useState } from "react";
import moment from "moment";
import {useQuery,useQueryClient,useMutation} from "@tanstack/react-query"
import { makeRequest } from "../../axios.js";
import { AuthContext } from "../../context/authContext.js";

const Post = ({ post }) => {
  
  const [commentOpen, setCommentOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const {currentUser} = useContext(AuthContext);
  const { isPending, error, data } = useQuery({
    queryKey: ['likes',post._id],
    queryFn: () =>
      makeRequest.get("/likes?postId="+post._id).then(res=>{
        return res.data;
        
      })
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (liked)=>{
      if(liked) return makeRequest.delete("/likes?postId="+post._id);
      return makeRequest.post("/likes",{postId:post._id});
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["likes"] })
    },
  })


const handleLike=()=>{
mutation.mutate(data && data.includes(currentUser._id))
};


const deleteMutation = useMutation({
  mutationFn: (postId)=>{
    return makeRequest.delete("/posts?postId="+postId);
  },
  onSuccess: () => {
    // Invalidate and refetch
    queryClient.invalidateQueries({ queryKey: ["posts"] })
  },
})

const handleDelete = ()=>{
deleteMutation.mutate(post._id)
}
  return (
    <div className="post">
      <div className="container">
        <div className="user">
          <div className="userInfo">
            <img src={post.profilePic} alt="" />
            <div className="details">
              <Link
                to={`/profile/${post.userId}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <span className="name">{post.name}</span>
              </Link>
              <span className="date">{moment(post.createdAt).fromNow()}</span>
            </div>
          </div>
          <MoreHorizIcon onClick={()=>setMenuOpen(!menuOpen)} />
          {menuOpen && post.userId == currentUser._id && (  <button onClick={handleDelete}>delete</button>)}
        </div>
        <div className="content">
          <p>{post.desc}</p>
          <img src={"./upload/"+post.img} alt="" />
        </div>
        <div className="info">
          <div className="item">
            {isPending? "loading" : data && data.includes(currentUser._id) ? ( <FavoriteOutlinedIcon style={{color:"red"}} onClick={handleLike}
            />) :(  <FavoriteBorderOutlinedIcon onClick={handleLike}/>)}
            {data && data.length}Likes
          </div>
          <div className="item" onClick={() => setCommentOpen(!commentOpen)}>
            <TextsmsOutlinedIcon />
            12 Comments
          </div>
          <div className="item">
            <ShareOutlinedIcon />
            Share
          </div>
        </div>
        {commentOpen && <Comments postId={post._id}/>}
      </div>
    </div>
  );
};

export default Post;
