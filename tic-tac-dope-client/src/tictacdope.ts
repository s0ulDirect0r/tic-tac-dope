
type Player = "X" | "O"
type Cell = Player | null

export interface GameState {
  board: Cell[][] | undefined[][],
  currentPlayer: Player | null,
  winner: Player | null
}

export const initialGameState: GameState = {
  board: [
    [null, null, null], 
    [null, null, null], 
    [null, null, null]
],
  currentPlayer: "X",
  winner: null
}

// Check if a player has won the game
export const isWinner = (board: Cell[][] | undefined[][], player: Player) => {
  // is there a smarter way than preprogramming conditions?
  // let's just do it dumb first
  // X Win States
  if(!player) {
    return null
  }
  // check the rows
  if (board[0].every(cell => cell === player) || board[1].every(cell => cell === player) || board[2].every(cell => cell === player)) {
    return player
  }

  // consolidate columns
  const columnOne = [board[0][0], board[1][0], board[2][0]]
  const columnTwo = [board[0][1], board[1][1], board[2][1]]
  const columnThree = [board[0][2], board[1][2], board[2][2]]

  if (columnOne.every(cell => cell === player) || columnTwo.every(cell => cell === player) || columnThree.every(cell => cell === player)) {
    return player
  }

  // check diaganols
  const diagonalOne = [board[0][0], board[1][1], board[2][2]]
  const diagonalTwo = [board[2][0], board[1][1], board[0][2]]
  // O Win State
  if(diagonalOne.every(cell => cell === player) || diagonalTwo.every(cell => cell === player)) {
    return player
  }

  return null
}

// When a user clicks on a square
// The game state is updated, so that the cell 
// makeMove(gameState, "X", )
export const makeMove = (gameState: GameState, row: number, column: number): GameState => {
  const gameStateCopy = {
    board: gameState.board,
    currentPlayer: gameState.currentPlayer,
    winner: gameState.winner
  }
  console.log(gameState.currentPlayer)
  gameStateCopy.board[row][column] = gameState.currentPlayer
  if (gameStateCopy.currentPlayer) {
    const winner = isWinner(gameStateCopy.board, gameStateCopy.currentPlayer)
    gameStateCopy.winner = winner
  }

  if(gameStateCopy.currentPlayer === "X") {
    gameStateCopy.currentPlayer = "O"
  } else if(gameStateCopy.currentPlayer === "O") {
    gameStateCopy.currentPlayer = "X"
  }

  return gameStateCopy
}