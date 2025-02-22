import User from "../model/User.js";
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
import Workspace from "../model/WorkSpace.js";
import Subscription from "../model/Subcriptions.js";
import PremiumPlans from "../model/PremiunPlans.js";

const seedDatabase = async () => {
  try {
    // Create Users
    const users = await User.bulkCreate([
      {
        userId: 1,
        fullName: "Alice",
        password: "password123",
        email: "alice@example.com",
      },
      {
        userId: 2,
        fullName: "Bob",
        password: "password456",
        email: "bob@example.com",
      },
      {
        userId: 3,
        fullName: "Charlie",
        password: "password789",
        email: "charlie@example.com",
      },
      {
        userId: 4,
        fullName: "David",
        password: "password101",
        email: "david@example.com",
      },
      {
        userId: 5,
        fullName: "Eve",
        password: "password202",
        email: "eve@example.com",
      },
    ]);

    // Create Workspaces
    const workspaces = await Workspace.bulkCreate([
      {
        workspaceId: 1,
        name: "Workspace 1",
        description: "First workspace",
        type: "organization",
        createdBy: 1,
      },
      {
        workspaceId: 2,
        name: "Workspace 2",
        description: "Second workspace",
        type: "team",
        createdBy: 2,
      },
      {
        workspaceId: 3,
        name: "Workspace 3",
        description: "Third workspace",
        type: "team",
        createdBy: 3,
      },
    ]);

    // Create ManageMemberWorkSpaces
    await ManageMemberWorkSpace.bulkCreate([
      { workspaceId: 1, roleWorkSpace: "owner", userId: 1 },
      { workspaceId: 1, roleWorkSpace: "member", userId: 2 },
      { workspaceId: 2, roleWorkSpace: "admin", userId: 5 },
      { workspaceId: 2, roleWorkSpace: "member", userId: 3 },
      { workspaceId: 3, roleWorkSpace: "owner", userId: 4 },
    ]);

    // Create Spaces
    const spaces = await Space.bulkCreate([
      {
        spaceId: 1,
        name: "Space A",
        description: "First space",
        workspaceId: 1,
        createdBy: 1,
      },
      {
        spaceId: 2,
        name: "Space B",
        description: "Second space",
        workspaceId: 2,
        createdBy: 2,
      },
      {
        spaceId: 3,
        name: "Space C",
        description: "Third space",
        workspaceId: 3,
        createdBy: 3,
      },
    ]);

    // Create ManageMemberSpaces
    await ManageMemberSpace.bulkCreate([
      { userId: 1, spaceId: 1, roleSpace: "owner" },
      { userId: 2, spaceId: 1, roleSpace: "member" },
      { userId: 3, spaceId: 2, roleSpace: "admin" },
      { userId: 4, spaceId: 2, roleSpace: "member" },
      { userId: 5, spaceId: 3, roleSpace: "owner" },
    ]);

    // Create Folders
    const folders = await Folder.bulkCreate([
      {
        folderId: 1,
        name: "Folder 1",
        description: "First folder",
        spaceId: 1,
        createdBy: 1,
      },
      {
        folderId: 2,
        name: "Folder 2",
        description: "Second folder",
        spaceId: 2,
        createdBy: 2,
      },
      {
        folderId: 3,
        name: "Folder 3",
        description: "Third folder",
        spaceId: 3,
        createdBy: 3,
      },
    ]);

    // Create Lists
    const lists = await List.bulkCreate([
      {
        listId: 1,
        name: "List Alpha",
        description: "Alpha list",
        folderId: 1,
        createdBy: 1,
      },
      {
        listId: 2,
        name: "List Beta",
        description: "Beta list",
        folderId: 2,
        createdBy: 2,
      },
      {
        listId: 3,
        name: "List Gamma",
        description: "Gamma list",
        folderId: 3,
        createdBy: 3,
      },
    ]);

    // Create TaskColumns
    const columns = await TaskColumn.bulkCreate([
      { columnId: 1, name: "ToDo", listId: 1, color: '#FFFFFF', createdBy: 1, status: 1 },
      {
        columnId: 2,
        name: "In Progress",
        listId: 1,
        color: '#FFFFFF',
        createdBy: 1, status: 1,
      },
      { columnId: 3, name: "Done", listId: 2, color: '#FFFFFF', createdBy: 2, status: 1 },
      { columnId: 4, name: "Review", listId: 3, color: '#FFFFFF', createdBy: 3, status: 1 },
    ]);

    // Create Tasks
    const tasks = await Task.bulkCreate([
      {
        taskId: 1,
        title: "Task 1",
        description: "First task",
        taskColumnId: 1,
        status: 1,
        priority: "Easy",
      },
      {
        taskId: 2,
        title: "Task 2",
        description: "Second task",
        taskColumnId: 2,
        status: 2,
        priority: "Medium",
      },
      {
        taskId: 3,
        title: "Task 3",
        description: "Third task",
        taskColumnId: 3,
        status: 2,
        priority: "Medium",
      },
      {
        taskId: 4,
        title: "Task 4",
        description: "Fourth task",
        taskColumnId: 4,
        status: 3,
        priority: "High",
      },
    ]);

    // Create Comments
    await Comment.bulkCreate([
      { userId: 1, taskId: 1, content: "Great work!" },
      { userId: 2, taskId: 2, content: "Keep it up!" },
      { userId: 3, taskId: 3, content: "Needs improvement." },
      { userId: 4, taskId: 4, content: "Well done!" },
    ]);

    // Create Attachments
    await Attachment.bulkCreate([
      { taskId: 1, uploadedBy: 1, fileURL: "http://example.com/file1", taskId : 1 },
      { taskId: 2, uploadedBy: 2, fileURL: "http://example.com/file2", taskId : 2 },
      { taskId: 3, uploadedBy: 3, fileURL: "http://example.com/file3", taskId : 3 },
    ]);

    // Create Notifications
    await Notifications.bulkCreate([
      {
        taskId: 1,
        title: "Task Updated",
        content: "Task 1 updated successfully",
        commentId: 1,
      },
      {
        taskId: 4,
        title: "Task Reviewed",
        content: "Task 4 moved to review",
        commentId: 2,
      },
    ]);

    await PremiumPlans.bulkCreate([
      {
        planId: 1,
        planName: "Plan 1",
        price: 100,
        description: "upgrade to plan 1",
        duration: 30,
      },
      {
        planId: 2,
        planName: "Plan 2",
        price: 100,
        description: "upgrade to plan 2",
        duration: 90,
      },
    ]);

    await Subscription.bulkCreate([
      {
        subscriptionId: 1,
        userId: 1,
        workspaceId: 1,
        planId: 1,
      },
      {
        subscriptionId: 2,
        userId: 2,
        workspaceId: 2,
        planId: 2,
      },
    ]);

    console.log("Sample data inserted successfully.");
  } catch (error) {
    console.error("Error seeding database:", error.message, error);
  }
};

const clearAndSeedDatabase = async () => {
  try {
    // Clear all tables
    console.log("Clearing all data...");

    await Notifications.destroy({ where: {}, truncate: { cascade: true } });
    await Attachment.destroy({ where: {}, truncate: { cascade: true } });
    await Comment.destroy({ where: {}, truncate: { cascade: true } });
    await Task.destroy({ where: {}, truncate: { cascade: true } });
    await TaskColumn.destroy({ where: {}, truncate: { cascade: true } });
    await List.destroy({ where: {}, truncate: { cascade: true } });
    await Folder.destroy({ where: {}, truncate: { cascade: true } });
    await ManageMemberSpace.destroy({ where: {}, truncate: { cascade: true } });
    await Space.destroy({ where: {}, truncate: { cascade: true } });
    await ManageMemberWorkSpace.destroy({
      where: {},
      truncate: { cascade: true },
    });
    await Workspace.destroy({ where: {}, truncate: { cascade: true } });
    await User.destroy({ where: {}, truncate: { cascade: true } });
    await Subscription.destroy({ where: {}, truncate: { cascade: true } });
    await PremiumPlans.destroy({ where: {}, truncate: { cascade: true } });


    console.log("All data cleared. Re-seeding the database...");

    // Re-seed data
    await seedDatabase();

    console.log("Database reset and seeded successfully!");
  } catch (error) {
    console.error(
      "Error resetting and seeding the database:",
      error.message,
      error
    );
  }
};

export default clearAndSeedDatabase;
