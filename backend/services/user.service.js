import userModel from  "../models/user.model.js";
import Project from "../models/project.model.js";

export const createUser = async ({ email, password }) => {
  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  // Check if a user with the same email already exists
  const existingUser = await userModel.findOne({ email });
  if (existingUser) {
    const error = new Error("Email already registered");
    error.statusCode = 409; 
    throw error;
  }

  const hashedPassword = await userModel.hashPassword(password);

  const user = await userModel.create({
    email,
    password: hashedPassword,
  });

  return user;
};



export const getAllUsers = async ({ userId, projectId }) => {
  let excludeIds = [userId]; // always exclude self

  // If projectId is provided, also exclude collaborators
  if (projectId) {
    const project = await Project.findById(projectId).select("users");
    if (project) {
      excludeIds = [...excludeIds, ...project.users.map((id) => id.toString())];
    }
  }

  // Fetch all users except excluded ones
  const users = await userModel.find({
    _id: { $nin: excludeIds }
  });

  return users;
};