import express from "express"
import ViteExpress from "vite-express"
import { makeMove, type GameState } from './tictacdope'

const app = express()
app.use(express.json())

const gamesList: GameState[] = []

app.get("/game/:id", (req, res) => {
  console.log("retrieving game")
  const retrievedGame = gamesList[Number(req.params.id)]
  res.json(retrievedGame)
})

app.post("/move/:id", (req, res) => {
  console.log(req.body)
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
  console.log(gamesList)
  res.json(gamesList[nextId])
})

app.get("/games", (_, res) => {
  res.json(gamesList)
})

// this is gonna have to go
// app.post("/reset", (req, res) => {
//   gameState = {
//     board: [
//       [null, null, null], 
//       [null, null, null], 
//       [null, null, null]
//     ],
//     currentPlayer: "X",
//     winner: null,
//     stalemate: false
//   }
//   res.json(gameState)
// })

ViteExpress.listen(app, 3000, () => console.log("Server is listening..."))

