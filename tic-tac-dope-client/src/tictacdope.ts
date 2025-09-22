
type Player = "X" | "O"
type Cell = Player | null

interface GameState {
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
  if(gameStateCopy.currentPlayer === "X") {
    gameStateCopy.currentPlayer = "O"
  } else if(gameStateCopy.currentPlayer === "O") {
    gameStateCopy.currentPlayer = "X"
  }
  return gameStateCopy
}