import { useState } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import Game from "./components/Game"
import GameSelect from "./components/GameSelect"

const queryClient = new QueryClient()

function App() {
  const [selectedGame, setSelectedGame] = useState<string | null>(null)
 
  const handleSelectGameClick = (id: string) => {
    setSelectedGame(id)
  }

  const handleReturnToSelectClick = () => {
    setSelectedGame(null)
  }

  return (
    <QueryClientProvider client={queryClient}>
      <h1 className="text-center text-white mt-12 font-bold text-7xl">Tic-Tac-Dope</h1>
      {selectedGame ? <Game id={selectedGame} returnClick={handleReturnToSelectClick} /> : <GameSelect onClick={handleSelectGameClick} />}
    </QueryClientProvider>
  )
}

export default App
