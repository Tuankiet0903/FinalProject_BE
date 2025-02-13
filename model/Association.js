import User from "./User.js";
import Workspace from "./Workspace.js";
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


try {
  // Synchronize models
  await Promise.all([
    User.sync({ alter: true }),
    Workspace.sync({ alter: true }),
    Comment.sync({ alter: true }),
    ManageMemberWorkSpace.sync({ alter: true }),
    ManageMemberSpace.sync({ alter: true }),
    Attachment.sync({ alter: true }),
    Notifications.sync({ alter: true }),
    TaskColumn.sync({ alter: true }),
    List.sync({ alter: true }),
    Folder.sync({ alter: true }),
    Space.sync({ alter: true }),
    Task.sync({ alter: true }),
  ]);
  console.log("Database & tables create successfully.");
} catch (error) {
  console.error("Error syncing database:", error.message);
  process.exit(1);
}

// User Associations
User.hasMany(ManageMemberWorkSpace, { foreignKey: "userId" });
ManageMemberWorkSpace.belongsTo(User, { foreignKey: "userId" });

User.hasMany(ManageMemberSpace, { foreignKey: "userId" });
ManageMemberSpace.belongsTo(User, { foreignKey: "userId" });

User.hasMany(Comment, { foreignKey: "userId" });
Comment.belongsTo(User, { foreignKey: "userId" });

// Workspace Associations
ManageMemberWorkSpace.belongsTo(Workspace, { foreignKey: "workspaceId" });
Workspace.hasMany(ManageMemberWorkSpace, { foreignKey: "workspaceId" });

Workspace.hasMany(Space, { foreignKey: "workspaceId", as: "spaces" });
Space.belongsTo(Workspace, { foreignKey: "workspaceId", as: "workspace" });

// Space Associations
Space.hasMany(ManageMemberSpace, { foreignKey: "spaceId" });
ManageMemberSpace.belongsTo(Space, { foreignKey: "spaceId" });

Space.hasMany(Folder, { foreignKey: "spaceId", as: "folders"});
Folder.belongsTo(Space, { foreignKey: "spaceId", as: "space" });

// Folder Associations
Folder.hasMany(List, { foreignKey: "folderId", as: "lists" });
List.belongsTo(Folder, { foreignKey: "folderId", as: "folder" });

// List Associations
List.hasMany(TaskColumn, { foreignKey: "listId" });
TaskColumn.belongsTo(List, { foreignKey: "listId" });

// TaskColumn Associations
TaskColumn.hasMany(Task, { foreignKey: "taskColumnId" });
Task.belongsTo(TaskColumn, { foreignKey: "taskColumnId" });

// Task Associations
Task.hasOne(Notifications, { foreignKey: "taskId" });
Notifications.belongsTo(Task, { foreignKey: "taskId" });

Task.hasMany(Comment, { foreignKey: "taskId" });
Comment.belongsTo(Task, { foreignKey: "taskId" });

Task.hasOne(Attachment, { foreignKey: "taskId" });
Attachment.belongsTo(Task, { foreignKey: "taskId" });

// Comment Associations
Comment.hasOne(Notifications, { foreignKey: "commentId" });
Notifications.belongsTo(Comment, { foreignKey: "commentId" });


const syncDatabase = async () => {
  try {
    // Synchronize models
    await User.sync({ alter: true });
    await Workspace.sync({ alter: true });
    await Comment.sync({ alter: true });
    await ManageMemberWorkSpace.sync({ alter: true });
    await ManageMemberSpace.sync({ alter: true });
    await Attachment.sync({ alter: true });
    await Notifications.sync({ alter: true });
    await TaskColumn.sync({ alter: true });
    await List.sync({ alter: true });
    await Folder.sync({ alter: true });
    await Space.sync({ alter: true });
    await Task.sync({ alter: true });
    console.log("Database & tables synchronized successfully.");
  } catch (error) {
    console.error("Error syncing database:", error);
    process.exit(1);
  }
};

export default syncDatabase;
