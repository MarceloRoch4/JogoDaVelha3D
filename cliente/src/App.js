import './App.css';
import {JogoDaVelha} from "./components/JogoDaVelha";
import { io } from "socket.io-client";

// const socket = io("ws://localhost:3000"); // URL do servidor local
//const socket = io("wss://incredible-fast-vole.glitch.me"); // URL do servidor remoto
const socket = io("ws://localhost:3000"); // URL do servidor

export default function App() {
  return <JogoDaVelha socket={socket}/>
}