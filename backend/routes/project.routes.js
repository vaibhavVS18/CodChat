import {Router} from "express";
import {body, param} from "express-validator";  // validation middleware
import * as projectController from "../controllers/project.controller.js";
import * as authMiddleWare from "../middleware/auth.middleware.js"

const router = Router();

router.post("/create", authMiddleWare.authUser,
    body("name").isString().withMessage("Name is required"),  // using validation middlewares
    projectController.createProject
)

router.get("/all",authMiddleWare.authUser,
    projectController.getAllProjects
)

router.put("/add-user", authMiddleWare.authUser, 
    body('projectId').isString().withMessage("project id is required"),
    body("users").isArray().withMessage("Users must be an array").bail()
        .custom((users)=> users.every(user => typeof user ==='string')).withMessage("each User must be a string"),

    projectController.addUsersToProject
)

router.get("/get-project/:projectId", authMiddleWare.authUser, 
    projectController.getProjectById
)

router.post(
  "/add-message",
  authMiddleWare.authUser,
  body("projectId").isString().withMessage("project id is required"),
//   body("sender").isString().withMessage("sender id is required"),
  body("content")  // newMessage
    .notEmpty().withMessage("message content is required"),
  projectController.addMessageToProject
);

router.get("/:projectId/allMessages", 
        authMiddleWare.authUser,
      param("projectId").isString().withMessage("project id is required"),
      projectController.getAllMessages
)

router.delete(
  "/:projectId/allMessages",
  authMiddleWare.authUser,
  param("projectId").isString().withMessage("Project id is required"),
  projectController.deleteAllMessages
);

export default router;