import express from "express"
import ViteExpress from "vite-express"
import dotenv from 'dotenv'
import { drizzle } from "drizzle-orm/postgres-js"
import postgres from 'postgres'
import { makeMove, type GameState } from './tictacdope'
import { gamesTable } from "./db/schema"
import { eq } from "drizzle-orm"

dotenv.config()
const app = express()
const connectionString = process.env.DATABASE_URL!

export const client = postgres(connectionString, { prepare: false })
const db = drizzle(client)


async function main() {
  const game: typeof gamesTable.$inferInsert = {
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

  const insertResponse = await db.insert(gamesTable).values(game).returning();
  const { id } = insertResponse[0]
  console.log('new game created: ', insertResponse)

  const games = await db.select().from(gamesTable);
  console.log('Getting all games from the dataabse: ', games)

  await db
    .update(gamesTable)
    .set({
      winner: true
    })
    .where(eq(gamesTable.id, id))

  await db.delete(gamesTable).where(eq(gamesTable.id, id))
  console.log('Game deleted')
}

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
  const id = crypto.randomUUID()

  gamesList.push({
    id,
    board: [
      ["", "", ""], 
      ["", "", ""], 
      ["", "", ""]
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

main()
ViteExpress.listen(app, 3000, () => console.log("Server is listening..."))

