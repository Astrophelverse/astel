const { Server } = require('socket.io');

let io;

const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000', 'http://localhost:8081'],
      credentials: true
    }
  });

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Handle user authentication
    socket.on('authenticate', (data) => {
      try {
        // Verify user token and set user data
        socket.userId = data.userId;
        socket.join(`user_${data.userId}`);
        console.log('User authenticated:', data.userId);
      } catch (error) {
        console.error('Socket authentication error:', error);
      }
    });

    // Handle user joining a room
    socket.on('join_room', (roomId) => {
      socket.join(roomId);
      console.log('User joined room:', roomId);
    });

    // Handle user leaving a room
    socket.on('leave_room', (roomId) => {
      socket.leave(roomId);
      console.log('User left room:', roomId);
    });

    // Handle typing indicators
    socket.on('typing_start', (data) => {
      socket.to(data.roomId).emit('user_typing', {
        userId: socket.userId,
        isTyping: true
      });
    });

    socket.on('typing_stop', (data) => {
      socket.to(data.roomId).emit('user_typing', {
        userId: socket.userId,
        isTyping: false
      });
    });

    // Handle online status
    socket.on('set_online', () => {
      if (socket.userId) {
        io.emit('user_online', { userId: socket.userId });
      }
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      if (socket.userId) {
        io.emit('user_offline', { userId: socket.userId });
      }
      console.log('User disconnected:', socket.id);
    });
  });

  console.log('✅ Socket.IO initialized successfully');
};

const getIO = () => {
  if (!io) {
    throw new Error('Socket.IO not initialized. Call initializeSocket() first.');
  }
  return io;
};

const emitToUser = (userId, event, data) => {
  try {
    io.to(`user_${userId}`).emit(event, data);
  } catch (error) {
    console.error('Error emitting to user:', error);
  }
};

const emitToRoom = (roomId, event, data) => {
  try {
    io.to(roomId).emit(event, data);
  } catch (error) {
    console.error('Error emitting to room:', error);
  }
};

const broadcastToAll = (event, data) => {
  try {
    io.emit(event, data);
  } catch (error) {
    console.error('Error broadcasting to all:', error);
  }
};

module.exports = {
  initializeSocket,
  getIO,
  emitToUser,
  emitToRoom,
  broadcastToAll
};
