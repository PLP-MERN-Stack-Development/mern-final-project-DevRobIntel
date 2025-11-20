// server/socket.js
import { Server } from 'socket.io';

let io;

export const initializeSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: ['http://localhost:5173', 'http://localhost:3000'],
      methods: ['GET', 'POST'],
      credentials: true
    },
    pingTimeout: 60000,
    pingInterval: 25000
  });

  console.log('Socket.IO server initialized');

  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    // Every authenticated user joins their own room using their user ID
    socket.on('joinUserRoom', (userId) => {
      if (userId) {
        socket.join(userId);
        console.log(`User ${userId} joined their notification room`);
      }
    });

    // Optional: broadcast new post to everyone
    socket.on('newPost', (post) => {
      socket.broadcast.emit('newPost', post); // everyone except sender sees it
    });

    // You can add more events later (typing, online users, etc.)
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  return io;
};

// Export io so you can use it in routes
export { io };