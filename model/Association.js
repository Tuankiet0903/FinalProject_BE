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

User.hasMany(ManageMemberWorkSpace);
ManageMemberWorkSpace.belongsTo(User);

User.hasMany(ManageMemberSpace);
ManageMemberSpace.belongsTo(User);

User.hasMany(Comment);
Comment.belongsTo(User);

ManageMemberWorkSpace.belongsTo(Workspace);
Workspace.hasMany(ManageMemberWorkSpace);

Workspace.hasMany(Space);
Space.belongsTo(Workspace);

Space.hasMany(ManageMemberSpace);
ManageMemberSpace.belongsTo(Space);

Space.hasMany(Folder);
Folder.belongsTo(Space);

Folder.hasMany(List);
List.belongsTo(Folder);

List.hasMany(TaskColumn);
TaskColumn.belongsTo(List);

TaskColumn.hasMany(Task);
Task.belongsTo(TaskColumn);

Task.hasOne(Notifications);
Notifications.belongsTo(Task);

Task.hasMany(Comment);
Comment.belongsTo(Task);

Task.hasOne(Attachment);
Attachment.belongsTo(Task);

Comment.hasOne(Notifications);
Notifications.belongsTo(Comment);

export {
  User,
  Workspace,
  Task,
  Comment,
  ManageMemberWorkSpace,
  ManageMemberSpace,
  Attachment,
  Notifications,
  TaskColumn,
  List,
  Folder,
  Space,
};

const syncDatabase = async () => {
  try {
    await Promise.all([
      User.sync(),
      Workspace.sync(),
      Task.sync(),
      Comment.sync(),
      ManageMemberWorkSpace.sync(),
      ManageMemberSpace.sync(),
      Attachment.sync(),
      Notifications.sync(),
      TaskColumn.sync(),
      List.sync(),
      Folder.sync(),
      Space.sync(),
    ]);
    console.log("Database & tables synchronized successfully.");
  } catch (error) {
    console.error("Error syncing database:", error.message);
    process.exit(1);
  }
};

export default syncDatabase;