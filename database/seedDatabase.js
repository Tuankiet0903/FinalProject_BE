import User from "../model/User.js";
import Workspace from "../model/Workspace.js";
import Task from "../model/Task.js";
import Comment from "../model/Comment.js";
import ManageMemberSpace from "../model/ManageMemberSpace.js";
import Attachment from "../model/Attachment.js";
import Notifications from "../model/Notifications.js";
import TaskColumn from "../model/TaskColumn.js";
import List from "../model/List.js";
import Folder from "../model/Folder.js";
import Space from "../model/Space.js";
import ManageMemberWorkSpace from "../model/ManageMenberWorkSpace.js";

const seedDatabase = async () => {
    try {
      // ManageMemberWorkSpace.create({workspaceId : 1, roleWorkSpace: "owner", userId: 1}, {userId :['userId']})
      // Create Users
      const users = await User.bulkCreate([
        { userId: 1,fullName: "Alice", password: "password123", email: "alice@example.com" },
        { userId: 2,fullName: "Bob", password: "password456", email: "bob@example.com" },
        { userId: 3,fullName: "Charlie", password: "password789", email: "charlie@example.com" },
        { userId: 4,fullName: "David", password: "password101", email: "david@example.com" },
        { userId: 5,fullName: "Eve", password: "password202", email: "eve@example.com" },
      ]);
  
      // Create Workspaces
      const workspaces = await Workspace.bulkCreate([
        { workspaceId: 1,name: "Workspace 1", description: "First workspace", type : 'organization', createBy : 1},
        { workspaceId: 2,name: "Workspace 2", description: "Second workspace" , type : 'team',createBy : 2},
        { workspaceId: 3,name: "Workspace 3", description: "Third workspace" , type : 'team',createBy : 3},
      ]);
  
      // Create ManageMemberWorkSpaces
      await ManageMemberWorkSpace.bulkCreate([
        { workspaceId: workspaces[0].workspaceId, roleWorkSpace: "owner" ,userId : 1},
        { workspaceId: workspaces[0].workspaceId, roleWorkSpace: "member" ,userId : 2},
        { workspaceId: workspaces[1].workspaceId, roleWorkSpace: "admin" ,userId : 5},
        { workspaceId: workspaces[1].workspaceId, roleWorkSpace: "member" ,userId : 3},
        { workspaceId: workspaces[2].workspaceId, roleWorkSpace: "owner" ,userId : 4},
      ]);
  
      // Create Spaces
      const spaces = await Space.bulkCreate([
        { spaceId: 1,name: "Space A", description: "First space", workspaceId: workspaces[0].workspaceId, createBy : 1 },
        { spaceId: 2,name: "Space B", description: "Second space", workspaceId: workspaces[1].workspaceId, createBy : 2},
        { spaceId: 3,name: "Space C", description: "Third space", workspaceId: workspaces[2].workspaceId, createBy : 3 },
      ]);
  
      // Create ManageMemberSpaces
      await ManageMemberSpace.bulkCreate([
        { userId: users[0].userId, spaceId: spaces[0].spaceId, roleSpace: "owner" },
        { userId: users[1].userId, spaceId: spaces[0].spaceId, roleSpace: "member" },
        { userId: users[2].userId, spaceId: spaces[1].spaceId, roleSpace: "admin" },
        { userId: users[3].userId, spaceId: spaces[1].spaceId, roleSpace: "member" },
        { userId: users[4].userId, spaceId: spaces[2].spaceId, roleSpace: "owner" },
      ]);
  
      // Create Folders
      const folders = await Folder.bulkCreate([
        { folderId: 1,name: "Folder 1", description: "First folder", spaceId: spaces[0].spaceId ,createdBy : 1 },
        { folderId: 2,name: "Folder 2", description: "Second folder", spaceId: spaces[1].spaceId ,createdBy : 2 },
        { folderId: 3,name: "Folder 3", description: "Third folder", spaceId: spaces[2].spaceId ,createdBy : 3 },
      ]);
  
      // Create Lists
      const lists = await List.bulkCreate([
        { listId: 1,name: "List Alpha", description: "Alpha list", folderId: folders[0].folderId ,createBy : 1},
        { listId: 2,name: "List Beta", description: "Beta list", folderId: folders[1].folderId ,createBy : 1},
        { listId: 3,name: "List Gamma", description: "Gamma list", folderId: folders[2].folderId ,createBy : 1},
      ]);
  
      // Create TaskColumns
      const columns = await TaskColumn.bulkCreate([
        { columnId: 1, name: "To Do", listId: lists[0].listId, orderIndex: 1 ,createBy : 1},
        { columnId: 2, name: "In Progress", listId: lists[0].listId, orderIndex: 2 ,createBy : 1},
        { columnId: 3, name: "Done", listId: lists[1].listId, orderIndex: 1 ,createBy : 1},
        { columnId: 4, name: "Review", listId: lists[2].listId, orderIndex: 2 ,createBy : 1},
      ]);
  
      // Create Tasks
      const tasks = await Task.bulkCreate([
        { taskId: 1, title: "Task 1", description: "First task", taskColumnId: columns[0].columnId, title : "Second task", status: "todo", priority: 'low',},
        { taskId: 2, title: "Task 2", description: "Second task", taskColumnId: columns[1].columnId, title : "Second task", status: "todo", priority: 'low',},
        { taskId: 3, title: "Task 3", description: "Third task", taskColumnId: columns[2].columnId, title : "Second task", status: "todo", priority: 'low',},
        { taskId: 4, title: "Task 4", description: "Fourth task", taskColumnId: columns[3].columnId, title : "Second task", status: "todo", priority: 'low',},
        { taskId: 5, title: "Task 5", description: "Fifth task", taskColumnId: columns[0].columnId, title : "Second task", status: "todo", priority: 'low',},
      ]);
  
      // Create Comments
      await Comment.bulkCreate([
        { userId: users[0].userId, taskId: tasks[0].taskId, content: "Great work!" },
        { userId: users[1].userId, taskId: tasks[1].taskId, content: "Keep it up!" },
        { userId: users[2].userId, taskId: tasks[2].taskId, content: "Needs improvement." },
        { userId: users[3].userId, taskId: tasks[3].taskId, content: "Well done!" },
        { userId: users[4].userId, taskId: tasks[4].taskId, content: "Fantastic!" },
      ]);
  
      // Create Attachments
      await Attachment.bulkCreate([
        { taskId: tasks[0].taskId, uploadedBy: users[0].userId, fileURL: "http://example.com/file1" },
        { taskId: tasks[1].taskId, uploadedBy: users[1].userId, fileURL: "http://example.com/file2" },
        { taskId: tasks[2].taskId, uploadedBy: users[2].userId, fileURL: "http://example.com/file3" },
      ]);
  
      // Create Notifications
      await Notifications.bulkCreate([
        { taskId: tasks[0].taskId, title: "Task Updated", content: "Task 1 updated successfully", commentId: 1 },
        { taskId: tasks[3].taskId, title: "Task Reviewed", content: "Task 4 moved to review", commentId: 2 },
      ]);
  
      console.log("Sample data inserted successfully.");
    } catch (error) {
      console.error("Error seeding database:", error.message, error);
    }
  };

  
export default seedDatabase