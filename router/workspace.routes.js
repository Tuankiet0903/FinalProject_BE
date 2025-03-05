import express from "express";
import {
    createWorkspace,
    getAllWorkspaces,
    getWorkspaceById,
    updateWorkspace,
    deleteWorkspace,
    getUserWorkspaces,
    toggleFavorite,
    getWorkspacesByType,
    createWorkspaceWithDefaults
} from "../controller/WorkspaceController.js";
// import Auth from "../middleware/auth.js";

const router = express.Router();

router.post("/workspaces", createWorkspace); // Create a new workspace
router.get("/workspaces", getAllWorkspaces); // Get all workspaces
router.get("/workspaces/:id", getWorkspaceById); // Get a workspace by ID
router.put("/workspaces/:id", updateWorkspace); // Update a workspace by ID
router.delete("/workspaces/:id", deleteWorkspace); // Delete a workspace by ID
router.get("/workspaces/user/:userId", getUserWorkspaces); // Get workspaces by user ID
router.patch("/workspaces/:id/favorite", toggleFavorite); // Toggle favorite status of a workspace
router.get("/workspaces/type/:type", getWorkspacesByType); // Get workspaces by type



// Create a example workspace
router.post('/create-with-defaults', createWorkspaceWithDefaults);

export default router;