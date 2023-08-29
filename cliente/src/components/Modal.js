import './Modal.css'
import {useState} from "react";

export default function Modal({fecharModal, acao, modal= "inicio", setUrl}) {
  const [nome, setNome] = useState("")

  const modais = {
    inicio: {
      mensagem: "Insira seu nome",
      permitirCancelamento: false
    },
    reiniciar: {
      mensagem: "Deseja mesmo reiniciar partida?",
      permitirCancelamento: true
    },
    desistencia: {
      mensagem: "Deseja mesmo desistir da partida?",
      permitirCancelamento: true
    },
    espera: {
      mensagem: "Aguardando outro jogador...",
      permitirCancelamento: false
    },
    salaCheia: {
      mensagem: "A sala está cheia! Desconectando...",
      permitirCancelamento: false
    },
    erroSocket: {
      mensagem: "Não foi possível estabelecer conexão com o servidor.",
      permitirCancelamento: false
    },
  }

  function resolverAcao(){
    if (modal === 'inicio') {
      if (nome.length > 0) {
        acao(String(nome))
      }
      return
    }

    acao()
  }

  return (
    <div className='modal-container'>
      <div className='modal'>
        <span>
          <p style={{textAlign: 'center'}}>{modais[modal].mensagem}</p>
        </span>

        {modal === 'inicio' &&
          <input type="text" onChange={(event) => setNome(event.target.value)}/>
        }

        <div className='acoes'>
          { modais[modal].permitirCancelamento && <button onClick={fecharModal}>Cancelar</button> }
          { acao && <button disabled={modal === 'inicio' && nome.length === 0} onClick={resolverAcao}>Confirmar</button> }
        </div>
      </div>
    </div>
  )
}