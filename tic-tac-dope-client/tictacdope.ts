import { gamesTable } from "./db/schema"
export type Player = "X" | "O"
export type Cell = Player | ""

export interface GameState {
  id: string,
  roomNumber: number,
  board: Cell[][],
  currentPlayer: Player,
  winner: Player | null,
  stalemate: boolean
}

export const initialGameState: typeof gamesTable.$inferInsert = {
    id: crypto.randomUUID(),
    board: [
      ["", "", ""], 
      ["", "", ""], 
      ["", "", ""]
    ],
    currentPlayer: "X",
    winner: null,
    stalemate: false
}

export const isWinner = (board: Cell[][] | undefined[][], player: Player) => {
  if(!player) {
    return null
  }

  if (board[0].every(cell => cell === player) || board[1].every(cell => cell === player) || board[2].every(cell => cell === player)) {
    return player
  }

  const columnOne = [board[0][0], board[1][0], board[2][0]]
  const columnTwo = [board[0][1], board[1][1], board[2][1]]
  const columnThree = [board[0][2], board[1][2], board[2][2]]

  if (columnOne.every(cell => cell === player) || columnTwo.every(cell => cell === player) || columnThree.every(cell => cell === player)) {
    return player
  }

  const diagonalOne = [board[0][0], board[1][1], board[2][2]]
  const diagonalTwo = [board[2][0], board[1][1], board[0][2]]
  
  if(diagonalOne.every(cell => cell === player) || diagonalTwo.every(cell => cell === player)) {
    return player
  }

  return null
}

const isStalemate = (gameState: GameState) => {
  return gameState.board.every(row => row.every(cell => cell === "X" || cell === "O"))
}

export const makeMove = (gameState: GameState, row: number, column: number): GameState => {
  const gameStateCopy = {
    id: gameState.id,
    roomNumber: gameState.roomNumber,
    board: gameState.board,
    currentPlayer: gameState.currentPlayer,
    winner: gameState.winner,
    stalemate: gameState.stalemate
  }

  if(!gameStateCopy.board[row][column]) {
    gameStateCopy.board[row][column] = gameState.currentPlayer
  }

  if (gameStateCopy.currentPlayer) {
    const winner = isWinner(gameStateCopy.board, gameStateCopy.currentPlayer)
    gameStateCopy.winner = winner
    console.log("do you think there's a winner?")
    if(winner) return gameStateCopy
  } 
  
  gameStateCopy.stalemate = isStalemate(gameState)
  console.log('passed stalemate check')
  if(gameStateCopy.currentPlayer === "X") {
    console.log('getting here')
    gameStateCopy.currentPlayer = "O"
  } else if(gameStateCopy.currentPlayer === "O") {
    gameStateCopy.currentPlayer = "X"
  }

  return gameStateCopy
}