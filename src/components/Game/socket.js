import { io } from "socket.io-client";
export const socket = io.connect("https://tic-tac-toe-portfolio-server.onrender.com");
