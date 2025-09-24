import express from "express"
import ViteExpress from "vite-express"

const app = express()

export type Player = "X" | "O"
export type Cell = Player | null

export interface GameState {
  board: Cell[][] | undefined[][],
  currentPlayer: Player | null,
  winner: Player | null,
  stalemate: boolean
}

export const initialGameState: GameState = {
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
  res.json(initialGameState)
})

app.post("/move", () => {
  console.log("making a move!")
})

ViteExpress.listen(app, 3000, () => console.log("Server is listening..."))

