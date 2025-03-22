import express from "express";
import {
  getCountAllUser,
  getCountAllWorkspaceType,
  getCountAllWorkspaceByMonth,
  getCountAllWorkspaceByYear,
  getAllWorkspaces,
  getAllUsers,
  deleteWorkSpaceByID,
  deleteMultipleWorkspaces,
  deleteMultipleUsers,
  editBlockStatus,
  getAllPremiumPlan,
  deletePremiumPlanById,
  deleteMultiplePremiumPlans,
  editPlan,
  createPlan,
  getCountAllActiveUsers,
  getMembersByWorkspace,
  inviteMemberToWorkspace,
  activateUser,
  getUserRoleInWorkspace,
  resendInviteToWorkspace,
  exportExcel,
} from "../controller/AdminController.js";

import {
    deleteUser,
 } from "../controller/UserController.js";
import Auth from "../middleware/auth.js";

const router = express.Router();

// Dashboard
router.get("/getCountAllUsers", getCountAllUser); // get number of user
router.get("/getCountAllWorkspaceType", getCountAllWorkspaceType); // get number of workspace by type
router.get("/getCountAllWorkspaceByMonth", getCountAllWorkspaceByMonth); // get number of workspace by month
router.get("/getCountAllWorkspaceByYear", getCountAllWorkspaceByYear);  // get number of workspace by year
router.get("/getCountAllActiveUsers", getCountAllActiveUsers); // get number of active user


// Workspace List
router.get("/getAllWorkspace", getAllWorkspaces); // get all workspace
router.delete("/workspace/delete-multiple", deleteMultipleWorkspaces) // delete many by id
router.delete("/workspace/:id", deleteWorkSpaceByID) // delete 1 by id

//User
router.get("/getAllUser", getAllUsers);
router.delete("/users/delete-multiple", deleteMultipleUsers);
router.delete("/users/:id", deleteUser);
router.put("/users/update-block-status", editBlockStatus);
router.get("/manage-people/workspace/:workspaceId", getMembersByWorkspace);
router.post('/manage-people/invite', inviteMemberToWorkspace);
router.post("/manage-people/activate", activateUser);
router.get("/getRole/:userId/:workspaceId", getUserRoleInWorkspace);
router.post("/resend-invite", resendInviteToWorkspace);



//Premium
router.get("/getAllPremiumPlan", getAllPremiumPlan);
router.delete("/plans/delete-multiple", deleteMultiplePremiumPlans);
router.delete("/plans/:id", deletePremiumPlanById);
router.put("/plans/:id", editPlan);
router.post("/plans", createPlan);


// Export excel
router.get("/exportPayment", exportExcel);

export default router;
