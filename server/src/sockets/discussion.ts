import { Socket, Server } from "socket.io";

const discussionSockets = (socket: Socket, io: Server) => {
  socket.on("join", (discussionId) => {
    socket.join(discussionId);
    console.log(`User ${socket.id} joined discussion ${discussionId}`);
  });

  socket.on("leave", (discussionId) => {
    socket.leave(discussionId);
    console.log(`User ${socket.id} left discussion ${discussionId}`);
  });
};

export default discussionSockets;
