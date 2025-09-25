import express from "express"
import ViteExpress from "vite-express"
import dotenv from 'dotenv'
import { drizzle } from "drizzle-orm/postgres-js"
import postgres from 'postgres'
import { makeMove } from './tictacdope'
import { gamesTable } from "./db/schema"
import { eq } from "drizzle-orm"
import { Server } from 'socket.io'
import { createServer } from "node:http"
import morgan from 'morgan'

dotenv.config()
const app = express()
app.use(express.json())
app.use(morgan('combined'))
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

io.on('connection', (socket) => {
  console.log('a user connected')
  socket.on('move', (message) => {
    console.log('move: ', message)
  })
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
  io.emit('move', updatedGame[0])
  res.json(updatedGame[0])
})

app.post("/create", async (req, res) => {
  try {
   const returnedGames = await db.insert(gamesTable).values({
    id: crypto.randomUUID(),
    board: [
      ["", "", ""], 
      ["", "", ""], 
      ["", "", ""]
    ],
    currentPlayer: "X",
    winner: null,
    stalemate: false
    }).returning()
   const returnedGame = returnedGames[0]
    console.log(returnedGames)
    res.json(returnedGame)
  } catch (error) {
    console.log(error as Error)
  }
})

app.get("/games", async (_, res) => {
  const games = await db.select().from(gamesTable)
  res.json(games)
})

io.listen(4000)
ViteExpress.listen(app, 3000, () => console.log("Server is listening..."))
