import {useEffect, useState} from "react";
import './JogoDaVelha.css'
import {checarVitoria} from "../utils";
import Modal from "./Modal";

export function JogoDaVelha({socket}) {
  const [player, setPlayer] = useState(null);
  const [quemJoga, setQuemJoga] = useState('X');
  const [desistencia, setDesistencia] = useState(null);
  const [vencedor, setVencedor] = useState(null);
  const [modalAberto, setModalAberto] = useState(true)
  const [modalSelecionado, setModalSelecionado] = useState("erroSocket")

  const [estado, setEstado] = useState(Array(27).fill(null));
  const [mensagens, setMensagens] = useState([])
  const [mensagemAtual, setMensagemAtual] = useState('')
  const [nome, setNome] = useState('')
  const [jogoIniciou, setJogoIniciou] = useState(false)

  let idMensagem = 0 

  const inverso = {
    'X': 'O',
    'O': 'X'
  } // mapeamento para pegar o inverso, para pegar o outro jogador

  socket.on('atualizarEstado', (estado, proximoJogador) => {
    setEstado(estado);
    setQuemJoga(proximoJogador)
  })

  socket.on('disconnect', () => {
    console.log('desconectou')
  })

  socket.on('connect', () => {
    console.log("Socket conectado")
    abrirModal('inicio')
  })

  socket.on('desistir', (player) => {
    desistir(player)
  })

  socket.on('reiniciar', (idX, esperarDeNovo) => {
    if (idX === socket.id) {
      setPlayer('X')
    }

    novoJogo()

    if (esperarDeNovo) {
      abrirModal('espera')
    }
  })

  socket.on('mensagem', (mensagens) => {
    setMensagens(mensagens)
  })

  socket.on('limparModais', (todosPreparados) => {
    if (todosPreparados)
      setModalAberto(false)
      setJogoIniciou(true)
  })

  socket.on('clienteDesconectado', () => {
    console.log('fefe', jogoIniciou)
    if (jogoIniciou) { // se jogo tiver iniciado
      console.log(inverso[player], "desistiu")
      desistir(inverso[player])
    }
  })

  socket.on('atualizarPlayers', (socketId) => {
    if (socket.id === socketId)
      setPlayer('X')
    else
      setPlayer('O')
  })

  useEffect(() => {
    setVencedor(checarVitoria(estado));
  })

  function abrirModal(nomeModal) {
    setModalAberto(true)
    setModalSelecionado(nomeModal)
  }

  const modais = {
    inicio: <Modal modal="inicio" acao={salvarNome}/>,
    reiniciar: <Modal
      fecharModal={() => setModalAberto(false)}
      modal="reiniciar"
      acao={() => socket.emit('reiniciar')}
    />,
    desistencia: <Modal
      fecharModal={() => setModalAberto(false)}
      modal="desistencia"
      acao={() => socket.emit('desistir', player)}
    />,
    espera: <Modal
      fecharModal={() => setModalAberto(false)}
      modal="espera"
    />,
    salaCheia: <Modal
      fecharModal={() => setModalAberto(false)}
      modal="salaCheia"
    />,
    erroSocket: <Modal
      fecharModal={() => setModalAberto(false)}
      modal="erroSocket"
    />,
  }

  function salvarNome(nome) {
    setNome(nome)
    setModalSelecionado('espera')

    socket.emit('entrar', (response) => {
      console.log(response)
      if (response.salaCheia) {
        setModalSelecionado('salaCheia')
        socket.disconnect()
        return
      }
      console.log("response servidor: ", response)
      setPlayer(response.player)
      socket.emit('iniciar')
    })
  }

  function novoJogo() {
    setEstado(Array(27).fill(null))
    setDesistencia(null)
    setQuemJoga('X')
    setVencedor(null)
    setModalAberto(false)
  }

  function desistir(playerQueDesistiu) {
    setEstado(Array(27).fill(null))
    setDesistencia(playerQueDesistiu)
    setVencedor(inverso[playerQueDesistiu])
    setModalAberto(false) // fecha o modal de "quer mesmo desistir?"
  }

  function enviarMensagem(e) {
    e.preventDefault()

    if (mensagemAtual.length > 0) {
      socket.emit('mensagem', nome, mensagemAtual)
    }

    setMensagemAtual('')
  }

  function realizarJogada(indice) {
    console.log(player)
    console.log('quemjoga ', quemJoga)
    if (estado[indice] || checarVitoria(estado) || player !== quemJoga || desistencia) {
      return;
    }

    console.log('nova jogada client', indice)

    const estadoCopia = estado.slice();

    estadoCopia[indice] = player;
    socket.emit('atualizarEstado', estadoCopia, inverso[player])
  }

  function Campo({ value, indice }) {
    return (
      <td className="square" onClick={() => realizarJogada(indice)}>

        {value || <span style={{color: "#AAA"}}>{indice}</span>}
      </td>
    );
  }

  return (
    <div className='container'>
      <div className="jogo">
        <h2>Nome do jogador: {nome} | Simbolo: {player}</h2>

        <div id="tabuleiro">
          <table>
            <tbody>
              <tr>
                <Campo value={estado[0]} id="0" indice={0}/>
                <Campo value={estado[1]} id="1" indice={1}/>
                <Campo value={estado[2]} id="2" indice={2}/>
              </tr>
              <tr>
                <Campo value={estado[3]} id="3" indice={3}/>
                <Campo value={estado[4]} id="4" indice={4}/>
                <Campo value={estado[5]} id="5" indice={5}/>
              </tr>
              <tr>
                <Campo value={estado[6]} id="6" indice={6}/>
                <Campo value={estado[7]} id="7" indice={7}/>
                <Campo value={estado[8]} id="8" indice={8}/>
              </tr>
            </tbody>
          </table>
          <table>
            <tbody>
              <tr>
                <Campo value={estado[9]} id="9" indice={9}/>
                <Campo value={estado[10]} id="10" indice={10}/>
                <Campo value={estado[11]} id="11" indice={11}/>
              </tr>
              <tr>
                <Campo value={estado[12]} id="12" indice={12}/>
                <Campo value={estado[13]} id="13" indice={13}/>
                <Campo value={estado[14]} id="14" indice={14}/>
              </tr>
              <tr>
                <Campo value={estado[15]} id="15" indice={15}/>
                <Campo value={estado[16]} id="16" indice={16}/>
                <Campo value={estado[17]} id="17" indice={17}/>
              </tr>
            </tbody>
          </table>
          <table>
            <tbody>
              <tr>
                <Campo value={estado[18]} id="18" indice={18}/>
                <Campo value={estado[19]} id="19" indice={19}/>
                <Campo value={estado[20]} id="20" indice={20}/>
              </tr>
              <tr>
                <Campo value={estado[21]} id="21" indice={21}/>
                <Campo value={estado[22]} id="22" indice={22}/>
                <Campo value={estado[23]} id="23" indice={23}/>
              </tr>
              <tr>
                <Campo value={estado[24]} id="24" indice={24}/>
                <Campo value={estado[25]} id="25" indice={25}/>
                <Campo value={estado[26]} id="26" indice={26}/>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mensagem">
          {vencedor ?
            <h1 style={{color: 'green'}}>{`${vencedor} é o vencedor!`}</h1> : <h2>{`Vez do jogador: ${quemJoga}`}</h2>
          }
        </div>

        <div className="mensagem">
          <h3 style={{color: 'green'}}>{desistencia && `"${desistencia}" desistiu da partida, "${inverso[desistencia]}" venceu!`}</h3>
        </div>

        <div className="acoes">
          <button onClick={() => abrirModal("reiniciar")}>
            Reiniciar partida
          </button>

          <button disabled={Boolean(vencedor) || Boolean(desistencia)} onClick={() => abrirModal("desistencia")}>
            Desistir
          </button>
        </div>
      </div>

      <div className="chat">
        <div className="chat-text">
          <ul>
            {
              mensagens.map((data) =>
                <li id={idMensagem++}>{data['nome']}: {data['mensagem']}</li>
              )
            }
          </ul>
        </div>

        <form onSubmit={enviarMensagem}>
          <input
            type="text"
            value={mensagemAtual}
            onChange={(event) => setMensagemAtual(event.target.value)}
          />
          <button type='submit'>Enviar</button>
        </form>

      </div>

      {modalAberto && modais[modalSelecionado]}

    </div>
  )
}