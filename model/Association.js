import User from "./User.js";
import Workspace from "./WorkSpace.js";
import Task from "./Task.js";
import Comment from "./Comment.js";
import ManageMemberSpace from "./ManageMemberSpace.js";
import Attachment from "./Attachment.js";
import Notifications from "./Notifications.js";
import TaskColumn from "./TaskColumn.js";
import List from "./List.js";
import Folder from "./Folder.js";
import Space from "./Space.js";
import ManageMemberWorkSpace from "./ManageMenberWorkSpace.js";
import Subscription from "./Subcriptions.js";
import PremiumPlans from "./PremiunPlans.js";
import Otp from "./OTP.js";

// User ↔ Workspace
User.hasMany(Workspace, { foreignKey: "createdBy", onDelete: "CASCADE" });
Workspace.belongsTo(User, { foreignKey: "createdBy", onDelete: "CASCADE" });

// Workspace ↔ ManageMemberWorkSpace
Workspace.hasMany(ManageMemberWorkSpace, { foreignKey: "workspaceId", onDelete: "CASCADE" });
ManageMemberWorkSpace.belongsTo(Workspace, { foreignKey: "workspaceId", onDelete: "CASCADE" });

// User ↔ ManageMemberWorkSpace
User.hasMany(ManageMemberWorkSpace, { foreignKey: "userId", onDelete: "CASCADE" });
ManageMemberWorkSpace.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE" });

// Workspace ↔ Space
Workspace.hasMany(Space, { foreignKey: "workspaceId", onDelete: "CASCADE", as: "spaces" });
Space.belongsTo(Workspace, { foreignKey: "workspaceId", onDelete: "CASCADE", as: "workspace" });

// Space ↔ Folder
Space.hasMany(Folder, { foreignKey: "spaceId", onDelete: "CASCADE", as: "folders" });
Folder.belongsTo(Space, { foreignKey: "spaceId", onDelete: "CASCADE", as: "space" });

// Folder ↔ List
Folder.hasMany(List, { foreignKey: "folderId", onDelete: "CASCADE", as: "lists" });
List.belongsTo(Folder, { foreignKey: "folderId", onDelete: "CASCADE", as: "folder" });

// User ↔ Folder
User.hasMany(Folder, { foreignKey: "createdBy", onDelete: "SET NULL" });
Folder.belongsTo(User, { foreignKey: "createdBy", onDelete: "SET NULL" });

// List ↔ TaskColumn
List.hasMany(TaskColumn, { foreignKey: "listId", onDelete: "CASCADE" });
TaskColumn.belongsTo(List, { foreignKey: "listId", onDelete: "CASCADE" });

// TaskColumn ↔ Task
TaskColumn.hasMany(Task, { foreignKey: "taskColumnId", onDelete: "CASCADE" });
Task.belongsTo(TaskColumn, { foreignKey: "taskColumnId", onDelete: "CASCADE" });

// Task ↔ Comment
Task.hasMany(Comment, { foreignKey: "taskId", onDelete: "CASCADE" });
Comment.belongsTo(Task, { foreignKey: "taskId", onDelete: "CASCADE" });

// User ↔ Comment
User.hasMany(Comment, { foreignKey: "userId", onDelete: "CASCADE" });
Comment.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE" });

// Task ↔ Attachment
Task.hasMany(Attachment, { foreignKey: "taskId", onDelete: "CASCADE" });
Attachment.belongsTo(Task, { foreignKey: "taskId", onDelete: "CASCADE" });

// Attachment ↔ User
User.hasMany(Attachment, { foreignKey: "uploadedBy", onDelete: "SET NULL", as: "attachments" });
Attachment.belongsTo(User, { foreignKey: "uploadedBy", onDelete: "SET NULL", as: "uploader" });

// Task Hierarchy
Task.hasMany(Task, { foreignKey: "parentTaskId", as: "subTasks", onDelete: "CASCADE" });
Task.belongsTo(Task, { foreignKey: "parentTaskId", as: "parentTask", onDelete: "CASCADE" });

// User ↔ Task
User.hasMany(Task, { foreignKey: "assigneeId", onDelete: "SET NULL", as: "assignedTasks" });
Task.belongsTo(User, { foreignKey: "assigneeId", onDelete: "SET NULL", as: "assignee" });

User.hasMany(Task, { foreignKey: "createdBy", onDelete: "SET NULL" });
Task.belongsTo(User, { foreignKey: "createdBy", onDelete: "SET NULL" });

// User ↔ Notifications
User.hasMany(Notifications, { foreignKey: "userId", onDelete: "CASCADE" });
Notifications.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE" });

// Workspace ↔ Subscription
Workspace.hasMany(Subscription, { foreignKey: "workspaceId", onDelete: "CASCADE" });
Subscription.belongsTo(Workspace, { foreignKey: "workspaceId", onDelete: "CASCADE" });

// User ↔ Subscription
User.hasMany(Subscription, { foreignKey: "userId", onDelete: "CASCADE" });
Subscription.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE" });

// Space ↔ ManageMemberSpace
Space.hasMany(ManageMemberSpace, { foreignKey: "spaceId", onDelete: "CASCADE" });
ManageMemberSpace.belongsTo(Space, { foreignKey: "spaceId", onDelete: "CASCADE" });

// User ↔ ManageMemberSpace
User.hasMany(ManageMemberSpace, { foreignKey: "userId", onDelete: "CASCADE" });
ManageMemberSpace.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE" });

PremiumPlans.hasOne(Subscription, { foreignKey: "planId", onDelete: "CASCADE" });
Subscription.belongsTo(PremiumPlans, { foreignKey: "planId", onDelete: "CASCADE" });

User.hasOne(Otp, { foreignKey: "userId", onDelete: "CASCADE" });
Otp.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE" });

// Synchronize Database
const syncDatabase = async () => {
  try {
    await Promise.all([
      User.sync(),
      Workspace.sync(),
      ManageMemberWorkSpace.sync(),
      ManageMemberSpace.sync(),
      Space.sync(),
      Folder.sync(),
      List.sync(),
      TaskColumn.sync(),
      Task.sync(),
      Comment.sync(),
      Notifications.sync(),
      Attachment.sync(),
      Subscription.sync(),
      Otp.sync(),
    ]);
    console.log("Database synchronized successfully.");
  } catch (error) {
    console.error("Error syncing database:", error);
  }
};

export default syncDatabase;
