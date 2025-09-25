import express from "express"
import ViteExpress from "vite-express"
import dotenv from 'dotenv'
import { drizzle } from "drizzle-orm/postgres-js"
import postgres from 'postgres'
import { makeMove, type GameState } from './tictacdope'

dotenv.config()
const app = express()
const connectionString = process.env.DATABSE_URL!
export const client = postgres(connectionString, { prepare: false })
const db = drizzle(client)

app.use(express.json())

const gamesList: GameState[] = []

app.get("/game/:id", (req, res) => {
  const retrievedGame = gamesList[Number(req.params.id)]
  res.json(retrievedGame)
})

app.post("/move/:id", (req, res) => {
  const movedGame = gamesList[Number(req.params.id)]
   = makeMove(req.body.gameState, req.body.row, req.body.column)
  res.json(movedGame)
})

app.post("/create", (req, res) => {
  const nextId = gamesList.length
  gamesList.push({
    id: `${nextId}`,
    board: [
      [null, null, null], 
      [null, null, null], 
      [null, null, null]
    ],
    currentPlayer: "X",
    winner: null,
    stalemate: false
  })

  res.json(gamesList)
})

app.get("/games", (_, res) => {
  res.json(gamesList)
})

ViteExpress.listen(app, 3000, () => console.log("Server is listening..."))

