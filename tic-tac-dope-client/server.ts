import express from "express"
import ViteExpress from "vite-express"
import dotenv from 'dotenv'
import { drizzle } from "drizzle-orm/postgres-js"
import postgres from 'postgres'
import { initialGameState, makeMove, type GameState } from './tictacdope'
import { gamesTable } from "./db/schema"
import { eq } from "drizzle-orm"

dotenv.config()
const app = express()
const connectionString = process.env.DATABASE_URL!

export const client = postgres(connectionString, { prepare: false })
const db = drizzle(client)

app.use(express.json())

app.get("/game/:id", async (req, res) => {
  const { id }= req.params
  const retrievedGame = await db.select().from(gamesTable).where(eq(gamesTable.id, id))
  res.json(retrievedGame[0])
})

// app.post("/move/:id", (req, res) => {
//   const movedGame = gamesList[Number(req.params.id)]
//    = makeMove(req.body.gameState, req.body.row, req.body.column)
//   res.json(movedGame)
// })

app.post("/create", async (req, res) => {
  const returnedGames = await db.insert(gamesTable).values(initialGameState).returning()
  const returnedGame = returnedGames[0]
  console.log('creating a game!: ', returnedGame)
  res.json(returnedGame)
})

app.get("/games", async (_, res) => {
  const games = await db.select().from(gamesTable)
  console.log('retrieving games: ', games)
  res.json(games)
})

ViteExpress.listen(app, 3000, () => console.log("Server is listening..."))

