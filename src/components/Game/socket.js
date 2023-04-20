import { io } from "socket.io-client";
export const socket = io.connect(process.env.REACT_APP_SERVER_PORT);
