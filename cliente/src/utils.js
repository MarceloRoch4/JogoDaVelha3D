function gerarTrincasVitoriosas() {
  // Uma trinca vitoriosa é constituída de três marcações que formam uma jogada que acaba o jogo
  /*
      ex.:
        x | x | x
      -----------
         |   |
      -----------
        |   |

   */

  const trincasVitoriosas = [
// trincas diagonais que cortam as 3 dimenções (diagonal do cubo)
    [0, 13, 26],
    [2, 13, 24],
    [8, 13, 18],
    [6, 13, 20],

// trincas diagonais que cortam 2 dimenções (diagonal de uma face)
    [0, 12, 24],
    [1, 13, 25],
    [2, 14, 26],
    [2, 10, 18],
    [5, 13, 21],
    [8, 16, 24],
    [6, 12, 18],
    [7, 13, 19],
    [8, 14, 20],
    [0, 10, 20],
    [3, 13, 23],
    [6, 16, 26],
    [0, 4, 8],
    [9, 13, 17],
    [18, 22, 26],
    [2, 4, 6],
    [11, 13, 15],
    [20, 22, 24],
  ]

  // trincas unidimencionais (verticais, horizontais e em profundidade)
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      let trincaLinha = []
      let trincaColuna = []
      let trincaProfundidade = []

      for (let k = 0; k < 3; k++) {
        trincaLinha.push(parseInt(`${i}${j}${k}`, 3))
        trincaColuna.push(parseInt(`${i}${k}${j}`, 3))
        trincaProfundidade.push(parseInt(`${k}${i}${j}`, 3))
      }

      trincasVitoriosas.push(trincaLinha)
      trincasVitoriosas.push(trincaColuna)
      trincasVitoriosas.push(trincaProfundidade)
    }
  }

  return trincasVitoriosas
}

export function checarVitoria(estado) { // "X" ou "O"
  for (const trinca of gerarTrincasVitoriosas()) {
    // exemplo de trinca = [0, 1, 2]
    const [x, y, z] = trinca
    if (
      estado[x] &&
      estado[x] ===  estado[y] &&
      estado[y] === estado[z]
    )
      return estado[x]
  }

  return null
}

