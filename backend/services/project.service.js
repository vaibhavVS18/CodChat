import mongoose from "mongoose";
import projectModel from "../models/project.model.js";

export const createProject = async({name, userId})=>{
    if(!name){
        throw new Error("Name is required");
    }
    if(!userId){
        throw new Error("User is required");
    }

    let project;
    try{
        project = await projectModel.create({
            name,
            users: [userId]
        });
    }catch(error){
        if(error.code===11000){
            throw new Error("Project name already exists");
        }
        throw error;
    }

    return project;
}


export const getAllProjects = async({userId})=>{
    if(!userId){
        throw new Error("UserId is required");
    }

    const projects = await projectModel.find({users: userId});
    return projects;
}

export const addUsersToProject = async({projectId, users, currUserId})=>{
    if(!projectId){
        throw new Error("projectId is required");
    }
    if(!mongoose.Types.ObjectId.isValid(projectId)){
        throw new Error("Invalid projectId");
    }

    if(!users){
        throw new Error("users are required");
    }
    if(!Array.isArray(users) || users.some(userId => !mongoose.Types.ObjectId.isValid(userId))){
        throw new Error("Invalid userIds in users array");
     }

     if(!currUserId){
        throw new Error("currUserId is required");
     }
    if(!mongoose.Types.ObjectId.isValid(currUserId)){
        throw new Error("Invalid userId");
    }

    const project  = await projectModel.findOne({
        _id: projectId,
        users: currUserId
    })
    if(!project){
        throw new Error("user not belong to this project");
    }

    const updatedProject = await projectModel.findOneAndUpdate({
        _id: projectId
    },{
        $addToSet: {
            users: {
                $each: users
            }
        }
    },{
        new: true
    }).populate("users");

    return updatedProject;
}


export const addMessageToProject = async ({ projectId, sender, content, currUserId }) => {
  if (!projectId) {
    throw new Error("projectId is required");
  }
  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    throw new Error("Invalid projectId");
  }

  if (!sender) {
    throw new Error("sender is required");
  }
//   if (!mongoose.Types.ObjectId.isValid(sender)) {
//     throw new Error("Invalid sender id");
//   }

  if (!content) {
    throw new Error("content is required");
  }

  if (!currUserId) {
    throw new Error("currUserId is required");
  }
  if (!mongoose.Types.ObjectId.isValid(currUserId)) {
    throw new Error("Invalid userId");
  }

  // Ensure user belongs to this project
  const project = await projectModel.findOne({
    _id: projectId,
    users: currUserId,
  });

  if (!project) {
    throw new Error("User does not belong to this project");
  }

  // Push message into project
  project.messages.push({
    sender,
    content,   // newMessage
    timestamp: new Date(),
  });

  await project.save();

  return project;
};

export const getMessages = async({projectId, currUserId})=>{
    if(!projectId){
        throw new Error("projectId is required");
    }
    if(!mongoose.Types.ObjectId.isValid(projectId)){
        throw new Error("invalid projectId");
    }

      if (!currUserId) {
        throw new Error("currUserId is required");
    }
    if (!mongoose.Types.ObjectId.isValid(currUserId)) {
        throw new Error("Invalid userId");
    }

  // Ensure user belongs to this project
  const project = await projectModel
    .findOne({ _id: projectId, users: currUserId })
    .select("messages");

  if (!project) {
    throw new Error("Project not found or user not a member");
  }

  return project.messages;
}

export const deleteAllMessages = async ({ projectId, currUserId }) => {
  if (!projectId) throw new Error("projectId is required");
  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    throw new Error("Invalid projectId");
  }

  if (!currUserId) throw new Error("currUserId is required");
  if (!mongoose.Types.ObjectId.isValid(currUserId)) {
    throw new Error("Invalid userId");
  }

  // Ensure user belongs to this project
  const project = await projectModel.findOne({ _id: projectId, users: currUserId });
  if (!project) {
    throw new Error("Project not found or user not a member");
  }

  // Clear messages
  project.messages = [];
  await project.save();

  return { success: true, message: "All messages deleted successfully" };
};



export const getProjectById = async({projectId})=>{
    if(!projectId){
        throw new Error("projectId is required");
    }

    if(!mongoose.Types.ObjectId.isValid(projectId)){
        throw new Error("Invalid projetId");
    }

    const project = projectModel.findOne({
        _id: projectId
    }).populate('users')

    return project;
}

