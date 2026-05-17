"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
const http_1 = __importDefault(require("http"));
const app_1 = __importDefault(require("./app"));
const db_1 = require("./config/db");
const env_1 = require("./config/env");
const socket_io_1 = require("socket.io");
const server = http_1.default.createServer(app_1.default);
// Initialize WebSockets
const io = new socket_io_1.Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});
exports.io = io;
io.on('connection', (socket) => {
    console.log('A client connected:', socket.id);
    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});
// Connect to Database and start server
(0, db_1.connectDB)().then(() => {
    server.listen(env_1.config.port, () => {
        console.log(`Server running in ${env_1.config.nodeEnv} mode on port ${env_1.config.port}`);
    });
});
