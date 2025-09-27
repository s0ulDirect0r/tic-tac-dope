import express from "express"
import ViteExpress from "vite-express"
import dotenv from 'dotenv'
import { drizzle } from "drizzle-orm/postgres-js"
import postgres from 'postgres'
import { makeMove } from './tictacdope'
import { gamesTable } from "./db/schema"
import { eq, asc } from "drizzle-orm"
import { Server } from 'socket.io'
import { createServer } from "node:http"
import cors from 'cors'
// import morgan from 'morgan'

dotenv.config()
const app = express()
app.use(express.json())
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('dist'))
}
app.use(cors())
// app.use(morgan('combined'))
const server = createServer(app)

console.log(process.env.NODE_ENV)
const originUrl = process.env.NODE_ENV === 'production' ? '' : "http://localhost:3000"

const io = new Server(server, {
  cors: {
    origin: originUrl
  }
})

const connectionString = process.env.DATABASE_URL!
let client;
try {
  client = postgres(connectionString, { prepare: false }) 
} catch (error) {
  console.log(error)
  process.exit(1)
}

const db = drizzle(client)

app.use(express.json())

app.get("/game/:id", async (req, res) => {
  const { id }= req.params
  const retrievedGame = await db.select().from(gamesTable).where(eq(gamesTable.id, id))
  res.json(retrievedGame[0])
})

//
io.on('connection', (socket) => {
  console.log('a user connected')
  socket.on('join-game', (gameId) => {
    console.log(`game ${gameId} was joined`)
    socket.join(gameId)
  })
  socket.on('leave-game', (gameId) => {
    console.log(`game ${gameId} was left`)
    socket.leave(gameId)
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
  .returning()
  io.to(req.params.id).emit('move', updatedGame[0], () => {
    console.log(`move emitted to ${req.params.id}`)
  })
  console.log('move emitted!')
  res.json(updatedGame[0])
})

app.post("/create", async (req, res) => {
  try {
   const returnedGames = await db.insert(gamesTable).values({
    id: crypto.randomUUID(),
    roomNumber: Math.floor(Math.random() * 9999),
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
    res.json(returnedGame)
  } catch (error) {
    console.log(error as Error)
  }
})

app.get("/games", async (_, res) => {
  try {
    const games = await db.select().from(gamesTable).orderBy(asc(gamesTable.createdAt))
    res.json(games)
  } catch (error) {
    console.log(error as Error)
  } 
})

if (process.env.NODE_ENV === "development") {
  io.listen(4000)
  ViteExpress.listen(app, 3000, () => console.log("Server is listening..."))
} else {
  ViteExpress.bind(app, server)
  server.listen(3000, () => console.log('server is listening'))
}
