import express from "express"
import ViteExpress from "vite-express"
import dotenv from 'dotenv'
import { drizzle } from "drizzle-orm/postgres-js"
import postgres from 'postgres'
import { initialGameState, makeMove } from './tictacdope'
import { gamesTable } from "./db/schema"
import { eq } from "drizzle-orm"
import { Server } from 'socket.io'
import { createServer } from "node:http"

dotenv.config()
const app = express()
const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000"
  }
})

const connectionString = process.env.DATABASE_URL!

export const client = postgres(connectionString, { prepare: false })
const db = drizzle(client)

app.use(express.json())

app.get("/game/:id", async (req, res) => {
  const { id }= req.params
  const retrievedGame = await db.select().from(gamesTable).where(eq(gamesTable.id, id))
  res.json(retrievedGame[0])
})

io.on('connection', () => {
  console.log('a user connected')
})

app.post("/move/:id", async (req, res) => {
  const movedGame = makeMove(req.body.gameState, req.body.row, req.body.column)
  const updatedGame = await db.update(gamesTable).set({
    board: movedGame.board,
    currentPlayer: movedGame.currentPlayer,
    winner: movedGame.winner,
    stalemate: movedGame.stalemate
  })
  .where(eq(gamesTable.id, req.params.id))
  res.json(updatedGame[0])
})

app.post("/create", async (req, res) => {
  const returnedGames = await db.insert(gamesTable).values(initialGameState).returning()
  const returnedGame = returnedGames[0]
  res.json(returnedGame)
})

app.get("/games", async (_, res) => {
  const games = await db.select().from(gamesTable)
  res.json(games)
})

io.listen(4000)
ViteExpress.listen(app, 3000, () => console.log("Server is listening..."))

