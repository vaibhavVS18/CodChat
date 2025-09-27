import * as projectService from "../services/project.service.js";
import userModel from "../models/user.model.js";

import {validationResult} from "express-validator";

export const createProject = async(req, res)=>{
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

    try{
        const {name} = req.body;
        const loggedInUser = await userModel.findOne({email: req.user.email});
        const userId = loggedInUser._id;

        const newProject = await projectService.createProject({name, userId});

        res.status(201).json(newProject);
    }
    catch(err){
        console.log(err);
        res.status(400).send(err.message);
    }
}


export const getAllProjects = async(req, res)=>{
    try{
        // console.log(",,,,,,,,,,,,,,,,,,,,",req.user.email);
        const loggedInUser = await userModel.findOne({email: req.user.email});

        if (!loggedInUser) {
            return res.status(404).json({ error: "User not found" });
        }

        const userId = loggedInUser._id;
        const projects = await projectService.getAllProjects({userId});
        res.status(200).json({projects});
    }
    catch(err){
        console.log(err);
        res.status(400).json({error: err.message});
    }
}


export const addUsersToProject = async(req, res)=>{
    const errors  = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

    try{
        const {projectId, users} = req.body;
        const loggedInUser = await userModel.findOne({
            email: req.user.email
        })

        const project = projectService.addUsersToProject({projectId, users, currUserId: loggedInUser._id});

        return res.status(200).json({
            project,
        })
     }
    catch(err){
        console.log(err);
        res.status(400).json({error: err.message});
    }
}


export const addMessageToProject = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { projectId, sender, content } = req.body;

    // Validate logged in user
    const loggedInUser = await userModel.findOne({ email: req.user.email });
    if (!loggedInUser) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const project = await projectService.addMessageToProject({
      projectId,
      sender,
      content,
      currUserId: loggedInUser._id,
    });

    return res.status(200).json({
      message: "Message added successfully",
      project,
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};

export const getAllMessages = async (req, res)=>{

      //  Check for express-validator errors first
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const {projectId} = req.params;
        const loggedInUser = await userModel.findOne({email: req.user.email});

        const messages = await projectService.getMessages({projectId, currUserId: loggedInUser._id});
        
        return res.status(200).json({
            messages
        })
    }
    catch(err){
        res.status(400).json({error: err.message});
    }
}


export const deleteAllMessages = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { projectId } = req.params;
    const loggedInUser = await userModel.findOne({ email: req.user.email });

    const result = await projectService.deleteAllMessages({
      projectId,
      currUserId: loggedInUser._id,
    });

    return res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


export const getProjectById = async(req, res)=>{
    const {projectId} = req.params;

    try{
        const project = await projectService.getProjectById({projectId});

        return res.status(200).json({
            project
        })
    }
    catch(err){
        res.status(400).json({error: err.message});
    }
}

