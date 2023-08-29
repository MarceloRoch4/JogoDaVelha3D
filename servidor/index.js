const express = require('express');
const cors = require('cors');
const { Server } = require('http')
const socketIO = require('socket.io')

const app = express(); // lib pra criar uma aplicação web com o nodejs
const PORT = 4000;

const http = new Server(app);

app.use(cors()); // regra do servidor para aceitar qualquer cliente

const mensagens = []
let clients = [];

const io = socketIO(http, {
  cors: { // aceitar todos os clientes
    origin: "*"
  }
});

let clientesPreparados = {} //dicionário de socketID pra true ou false

io.on('connection', (socket) => {
  console.log('Novo usuario conectado!', socket.id);
  clients.push(socket.id); // adiciona o ID do client conectado na lista de clientes
  clientesPreparados[socket.id] = false
  console.log(clients)

  socket.on('disconnect', () => {
    if (clients.length === 2) {
      io.emit('clienteDesconectado')
    }

    console.log('Usuario desconectado');

    clients.splice(clients.indexOf(socket.id), 1)
    delete clientesPreparados[socket.id]

    console.log(clients)
  });

  socket.on('mensagem', (nome, mensagem) => {
    mensagens.push({
      nome: nome,
      mensagem: mensagem,
    })

    io.emit('mensagem', mensagens)
  })

  socket.on('atualizarEstado', (estado, proximoJogador) => {
    io.emit('atualizarEstado', estado, proximoJogador)
  })

  socket.on('desistir', (player) => {
    io.emit('desistir', player)
  })

  socket.on('reiniciar', () => {
    let esperarDeNovo = false

    if (clients.length === 1) {
      esperarDeNovo = true
    }

    io.emit('reiniciar', clients[0], esperarDeNovo) // Ao reiniciar devolve primeiro jogador para ser o X
  })

  socket.on('entrar', (callback) => {
    console.log('jogador entrou')
    const salaCheia = clients.length > 2

    if(!salaCheia) {
      io.emit('atualizarPlayers', clients[0])
      clientesPreparados[socket.id] = true
      io.emit('mensagem', mensagens)
    }

    callback({
      player: clients[0] === socket.id ? 'X' : 'O',
      salaCheia: salaCheia
    });
  })

  socket.on('iniciar', () => {
    const todosPreparados = !Object.values(clientesPreparados).includes(false)
    io.emit('limparModais', todosPreparados && clients.length > 1)
  })
});

http.listen(PORT, () => {
  console.log(`Servidor inicializado na porta ${PORT}`);
});
