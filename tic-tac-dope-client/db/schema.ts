import { pgTable, varchar, text, boolean, uuid, integer } from 'drizzle-orm/pg-core'

// // export interface GameState {
//   id: string;
//   board: Cell[][] | undefined[][],
//   currentPlayer: Player | null,
//   winner: Player | null,
//   stalemate: boolean
// }

export const gamesTable = pgTable("games", {
  id: uuid().primaryKey(),
  roomNumber: integer(),
  board: text('board').array().array().notNull().default([[], [], []]),
  currentPlayer: varchar({ length: 255 }).notNull(),
  winner: varchar({ length: 255 }),
  stalemate: boolean()
})