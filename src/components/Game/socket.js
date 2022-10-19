import { io } from "socket.io-client";
export const socket = io.connect("https://portfolio-tic-tac-toe-server.herokuapp.com");
