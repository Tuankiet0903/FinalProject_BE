import express from "express";
import {
    createFolder,
    getAllFolders,
    getFolderById,
    updateFolder,
    deleteFolder,
    getFoldersBySpace,
    getFoldersByUser
} from "../controller/FolderController.js";
// import Auth from "../middleware/auth.js";

const router = express.Router();

// Commented out authenticated routes for future use
// router.post("/folders", Auth, createFolder);
// router.get("/folders", Auth, getAllFolders);
// router.get("/folders/:id", Auth, getFolderById);
// router.put("/folders/:id", Auth, updateFolder);
// router.delete("/folders/:id", Auth, deleteFolder);
// router.get("/folders/space/:spaceId", Auth, getFoldersBySpace);
// router.get("/folders/user/:userId", Auth, getFoldersByUser);

// Current routes without authentication
router.post("/folders", createFolder); // Create a new folder
router.get("/folders", getAllFolders); // Get all folders
router.get("/folders/:id", getFolderById); // Get a folder by ID
router.put("/folders/:id", updateFolder); // Update a folder by ID
router.delete("/folders/:id", deleteFolder); // Delete a folder by ID
router.get("/folders/space/:spaceId", getFoldersBySpace); // Get folders by space ID
router.get("/folders/user/:userId", getFoldersByUser); // Get folders by user ID

export default router;