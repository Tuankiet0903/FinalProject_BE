import express from "express";
import {
    createList,
    getAllLists,
    getListById,
    updateList,
    deleteList,
    getListsByUser,
    getListsByColor,
    getListsByWorkspace
} from "../controller/ListController.js";
// import Auth from "../middleware/auth.js";

const router = express.Router();

// Commented out authenticated routes for future use
// router.post("/lists", Auth, createList);
// router.get("/lists", Auth, getAllLists);
// router.get("/lists/:id", Auth, getListById);
// router.put("/lists/:id", Auth, updateList);
// router.delete("/lists/:id", Auth, deleteList);
// router.get("/lists/user/:userId", Auth, getListsByUser);
// router.get("/lists/color/:colorTag", Auth, getListsByColor);

// Current routes without authentication
router.post("/lists", createList); // Create a new list
router.get("/lists", getAllLists); // Get all lists
router.get("/lists/:id", getListById); // Get a list by ID
router.put("/lists/:id", updateList); // Update a list by ID
router.delete("/lists/:id", deleteList); // Delete a list by ID
router.get("/lists/user/:userId", getListsByUser); // Get lists by user ID
router.get("/lists/color/:colorTag", getListsByColor); // Get lists by color tag
router.get('/workspace/:workspaceId/lists', getListsByWorkspace);

export default router;