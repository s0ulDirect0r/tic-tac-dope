import { integer, pgTable, varchar, text, boolean } from 'drizzle-orm/pg-core'

// // export interface GameState {
//   id: string;
//   board: Cell[][] | undefined[][],
//   currentPlayer: Player | null,
//   winner: Player | null,
//   stalemate: boolean
// }

export const gamesTable = pgTable("games", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  board: text('board').array().array(),
  currentPlayer: varchar({ length: 255 }).notNull(),
  winner: boolean(),
  stalemate: boolean()
})