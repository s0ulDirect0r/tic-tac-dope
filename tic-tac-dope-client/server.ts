import express from "express"
import ViteExpress from "vite-express"
import { makeMove } from './tictacdope'

const app = express()
app.use(express.json())

export type Player = "X" | "O"
export type Cell = Player | null

export interface GameState {
  board: Cell[][] | undefined[][],
  currentPlayer: Player | null,
  winner: Player | null,
  stalemate: boolean
}

let gameState: GameState = {
  board: [
    [null, null, null], 
    [null, null, null], 
    [null, null, null]
],
  currentPlayer: "X",
  winner: null,
  stalemate: false
}

app.get("/game", (_, res) => {
  console.log("retrieving game")
  res.json(gameState)
})

app.post("/move", (req, res) => {
  console.log(req.body)
  gameState = makeMove(req.body.gameState, req.body.row, req.body.column)
  res.json(gameState)
})

app.post("/reset", (req, res) => {
  gameState = {
    board: [
      [null, null, null], 
      [null, null, null], 
      [null, null, null]
    ],
    currentPlayer: "X",
    winner: null,
    stalemate: false
  }
  res.json(gameState)
})

ViteExpress.listen(app, 3000, () => console.log("Server is listening..."))

