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
    res.status(201).json({task:task,message:"successfullt task is created"});

    }catch(err){
        console.log(err);
        res.status(500).json({ message: 'Task Cannot be created' });
    }
})

router.get("/getallTask",isUser,async (req,res)=>{
    try{
        const tasks = await Task.find();
        res.status(200).json({task:tasks,message:"list of all task"});

    }catch(err){
        console.log(err);
        res.status(500).json({ message: 'Something went wrong' });
    }
})

router.get("/getOneTask/:id",isUser,async (req,res)=>{
    try{
        const taskId = req.params.id;
        const task = await Task.findById(taskId);
    
        if (!task) {
          return res.status(404).json({ message: 'Task not found' });
        }
    
        res.status(200).json({task:task,message:"This is the required task"});

    }catch(err){
        console.log(err);
        res.status(500).json({ message: 'Something went wrong' });
    }
})

router.delete("/deleteTask/:id",isUser,async (req,res)=>{
    try{
        const taskId = req.params.id;
        const task = await Task.findByIdAndDelete(taskId);
        if (!task) {
          return res.status(404).json({ message: 'Task not found' });
        }
    
        res.status(200).json({message:"deleted successfully",deletedtask:task});

    }catch(err){
        console.log(err);
        res.status(500).json({ message: 'Something went wrong' });
    }
})

router.post("/updateTask/:id",isUser,async (req,res)=>{
    try{
        const taskId = req.params.id;
        const {title,description,completionStatus}=req.body;
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
        //const formatted = currentDate.toISOString().split('T')[0];
       // const dateToStore = new Date(formattedDateTime);
       // console.log(formatted)
        const updates = {};

            if (title) updates.title = title;
            if (description) updates.description = description;

            // Check if 'completionStatus' is being updated
            if (completionStatus !== undefined) {
            updates.completionStatus = completionStatus;
            //updates.completedAt = completionStatus ? new Date() : null;
            }
            if(completionStatus==true && formattedDateTime){
                updates.completeAt=formattedDateTime
            }
            const task = await Task.findByIdAndUpdate(taskId, updates, { new: true });
        if (!task) {
          return res.status(404).json({ message: 'Task not found' });
        }
    
        res.status(200).json({message:"updated successfully",updatedTask:task});

    }catch(err){
        console.log(err);
        res.status(500).json({ message: 'Something went wrong' });
    }
})

router.post("/analytics",isUser,async(req,res)=>{
    try{

        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based, so we add 1
        const day = currentDate.getDate().toString().padStart(2, '0');
        const hours = currentDate.getHours().toString().padStart(2, '0');
        const minutes = currentDate.getMinutes().toString().padStart(2, '0');
        const seconds = currentDate.getSeconds().toString().padStart(2, '0');
        const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        console.log(formattedDateTime)
        const currentdate = new Date(formattedDateTime);
        const sevenDaysAgo =new Date(formattedDateTime)
        currentdate.setHours(23, 59, 59, 999);

        // Set the time component of sevenDaysAgo to the start of the day
        sevenDaysAgo.setHours(0, 0, 0, 0);
        
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const completedTasks = await Task.countDocuments({
            completionStatus: true,
            completeAt: { $gte: sevenDaysAgo, $lte: currentDate },
          });
        res.status(200).json({ completedTasks });
    }catch(err){
        console.log(err);
        res.status(500).json({ message: 'Something went wrong' });
    }
})
module.exports=router;