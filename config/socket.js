import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import ManageMemberWorkSpaceService from "../services/ManagerMemberWorkspaceService.js";

const configureSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: process.env.CLIENT_URL || "http://localhost:5173",
            methods: ["GET", "POST"],
            credentials: true
        }
    });

    // Middleware to authenticate socket connections
    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth.token;
            if (!token) {
                return next(new Error("Authentication error"));
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            socket.userId = decoded.userId;
            next();
        } catch (error) {
            next(new Error("Authentication error"));
        }
    });

    io.on("connection", async (socket) => {
        console.log(`User connected: ${socket.userId}`);

        // Join workspace rooms
        socket.on("join-workspace", async ({ workspaceId }) => {
            try {
                // const isMember = await ManageMemberWorkSpaceService.isMemberOfWorkspace(workspaceId, socket.userId);
                const isMember = true;
                if (isMember) {
                    socket.join(`workspace-${workspaceId}`);
                    console.log(`User ${socket.userId} joined workspace ${workspaceId}`);
                }else {
                    socket.emit("join-error", { message: "You are not a member of this workspace" });
                }
            } catch (error) {
                console.error("Error joining workspace:", error);
            }
        });

        // Leave workspace rooms
        socket.on("leave-workspace", ({ workspaceId }) => {
            socket.leave(`workspace-${workspaceId}`);
            console.log(`User ${socket.userId} left workspace ${workspaceId}`);
        });

        // Handle typing status
        socket.on("typing-start", ({ workspaceId }) => {
            socket.to(`workspace-${workspaceId}`).emit("user-typing", {
                userId: socket.userId,
                status: true
            });
        });

        socket.on("typing-end", ({ workspaceId }) => {
            socket.to(`workspace-${workspaceId}`).emit("user-typing", {
                userId: socket.userId,
                status: false
            });
        });

        // Handle disconnection
        socket.on("disconnect", () => {
            console.log(`User disconnected: ${socket.userId}`);
        });
    });

    return io;
};

export default configureSocket;