import express from "express";
import {
    createMessage,
    getMessages,
    updateMessage,
    deleteMessage
} from "../controller/WorkspaceMessageController.js";
import {
    addReaction,
    removeReaction,
    getReactions
} from "../controller/ReactionController.js";
import Auth from "../middleware/auth.js";

const router = express.Router();

// Message routes
router.post("/workspace/:workspaceId/messages", Auth, createMessage);
router.get("/workspace/:workspaceId/messages", getMessages);
router.put("/messages/:workspaceMessageId", Auth, updateMessage);
router.delete("/messages/:workspaceMessageId", Auth, deleteMessage);

// Reaction routes
router.post("/messages/:workspaceMessageId/reactions", Auth, addReaction);
router.delete("/messages/:workspaceMessageId/reactions/:reactionId", Auth, removeReaction);
router.get("/messages/:workspaceMessageId/reactions", Auth, getReactions);

export default router; 