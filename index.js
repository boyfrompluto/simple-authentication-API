const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authRoute = require("./routes/router");
const postRoute = require("./routes/post");
const sendmail= require("./routes/sendEmails")
const edit= require("./routes/viewdetail")
const upload= require("./routes/upload")
const app = express();


dotenv.config()  
const dbBackup = "mongodb://localhost:27017/todaydb" || process.env.db_connect


mongoose.connect(dbBackup).then(()=>console.log('connected to db')).catch((err)=>console.log(err))


app.use(express.json())


app.use("/upload",express.static("upload"))
app.use("/api/user", authRoute )
app.use("/api/posts", postRoute)
app.use("/api/sendmail", sendmail)
app.use("/api/edit", edit)
app.use("/api/photo/",upload)

app.listen(3000, () => console.log('hello'))

