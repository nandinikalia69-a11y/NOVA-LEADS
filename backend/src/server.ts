import http from 'http';
import app from './app';
import { connectDB } from './config/db';
import { config } from './config/env';
import { Server } from 'socket.io';

const server = http.createServer(app);

// Initialize WebSockets
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log('A client connected:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Make io accessible globally if needed, or pass it to controllers
export { io };

// Connect to Database and start server
connectDB().then(() => {
  server.listen(config.port, () => {
    console.log(`Server running in ${config.nodeEnv} mode on port ${config.port}`);
  });
});
