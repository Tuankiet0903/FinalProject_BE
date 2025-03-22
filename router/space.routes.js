import express from "express";
import {
   createSpace,
   getAllSpaces,
   getSpaceById,
   updateSpace,
   deleteSpace,
   getUserSpaces,
   toggleFavorite,
   getSpacesByWorkspaceId
} from "../controller/SpaceController.js";
import { fetchUserSpacesInWorkspaceController } from "../controller/ManageMemberSpaceController.js";
// import Auth from "../middleware/auth.js";

const router = express.Router();

// router.post("/spaces", Auth, createSpace); // Create a new space
// router.get("/spaces", Auth, getAllSpaces); // Get all spaces
// router.get("/spaces/:id", Auth, getSpaceById); // Get a space by ID
// router.put("/spaces/:id", Auth, updateSpace); // Update a space by ID
// router.delete("/spaces/:id", Auth, deleteSpace); // Delete a space by ID
// router.get("/spaces/user/:userId", Auth, getSpacesByUser); // Get spaces by user ID
// router.patch("/spaces/:id/favorite", Auth, toggleFavorite); // Toggle favorite status of a space


router.post("/spaces", createSpace); // Create a new space
router.get("/spaces", getAllSpaces); // Get all spaces
router.get("/spaces/:id", getSpaceById); // Get a space by ID
router.put("/spaces/:id", updateSpace); // Update a space by ID
router.delete("/spaces/:id", deleteSpace); // Delete a space by ID
router.get("/spaces/user/:userId", getUserSpaces); // Get spaces by user ID
router.patch("/spaces/:id/favorite", toggleFavorite); // Toggle favorite status of a space
router.get("/spaces/workspace/:workspaceId/allspaces", getSpacesByWorkspaceId); // Get spaces by user ID
router.get('/spaces/workspace/:workspaceId/user/:userId', fetchUserSpacesInWorkspaceController);



export default router;
