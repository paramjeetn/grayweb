import express from "express";
import cors from "cors";
import userRoutes from "./routes/user.js";
import postRoutes from "./routes/posts.js";
import commentRoutes from "./routes/comments.js";
import likeRoutes from "./routes/likes.js";
import authRoutes from "./routes/auth.js";
import relationshipRoutes from "./routes/relationship.js"
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import multer from "multer";


//config
const app = express();
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", true);
  next();
});
app.use(express.json());
app.use(cors(
    {
        origin: "http://localhost:3000",
        credentials: true
      }
));
app.use(cookieParser());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../client/public/upload')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now()+file.originalname)
  }
})

const upload = multer({ storage: storage })
mongoose.connect('mongodb+srv://paramjeetnpradhan:Paramjeet.826@cluster01.wmcwsfi.mongodb.net/DB2');

app.post("/Server/upload",upload.single("file"),(req,res)=>{
  const file=req.file;
  res.status(200).json(file.filename);
})
app.use("/Server/auth", authRoutes);
app.use("/Server/users", userRoutes); 
app.use("/Server/posts", postRoutes);
app.use("/Server/comments", commentRoutes);
app.use("/Server/likes", likeRoutes);
app.use("/Server/relationship", relationshipRoutes);



const PORT = 8000 || 6001;
app.listen(PORT, () => console.log(`Server Port: ${PORT}`));

