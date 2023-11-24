const express = require('express');
require("../db/connection");
const isUser= require("../middlewares/userAuthentication")
const User = require("../models/User");
const Task= require("../models/Task")
const router = express.Router()


router.post("/createTask",isUser,async(req,res)=>{
    try{
        const userId = req.userId;
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based, so we add 1
        const day = currentDate.getDate().toString().padStart(2, '0');
        const hours = currentDate.getHours().toString().padStart(2, '0');
        const minutes = currentDate.getMinutes().toString().padStart(2, '0');
        const seconds = currentDate.getSeconds().toString().padStart(2, '0');
        const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        console.log(formattedDateTime)
        const dateToStore = new Date(formattedDateTime);
    // Find the user in the database based on the ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Assuming the task data is sent in the request body
    const { title, description ,completionStatus} = req.body;

    // Create a new task with the user's name
    const task = new Task({
      title,
      description,
      assignedUser: user.username, // Use the user's name
      dueDate:dateToStore,
      completionStatus
    });

    await task.save();
    res.status(201).send(task);

    }catch(err){
        console.log(err);
        res.status(500).json({ message: 'Registration failed' });
    }
})

router.get("/getallTask",isUser,async (req,res)=>{
    try{
        const tasks = await Task.find();
        res.status(200).send(tasks);

    }catch(err){
        console.log(err);
        res.status(500).json({ message: 'Registration failed' });
    }
})

router.get("/getOneTask/:id",isUser,async (req,res)=>{
    try{
        const taskId = req.params.id;
        const task = await Task.findById(taskId);
    
        if (!task) {
          return res.status(404).json({ message: 'Task not found' });
        }
    
        res.status(200).send(task);

    }catch(err){
        console.log(err);
        res.status(500).json({ message: 'Registration failed' });
    }
})
module.exports=router;