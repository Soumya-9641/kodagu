const express= require('express');
require("./db/connection");
const cors = require('cors');
require('dotenv').config();
const app= express();
const user= require("./router/user")
const task= require('./router/task')
app.use(express.json())
app.use(cors());
app.use("/user",user);
app.use("/task",task);
app.get("/",(req,res)=>{
    res.send("hello world");
})

app.listen(5000,()=>{
    console.log("app is running on port 5000");
})