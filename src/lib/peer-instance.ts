import Peer from "peerjs";
import { io, type Socket } from "socket.io-client";

export const peer = new Peer();

export const socket: Socket = io(import.meta.env.VITE_URL, {
  transports: ['websocket'],
});
