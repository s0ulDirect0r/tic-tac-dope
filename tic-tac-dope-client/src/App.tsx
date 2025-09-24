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
      {selectedGame ? <Game id={selectedGame} returnClick={handleReturnToSelectClick} /> : <GameSelect onClick={handleSelectGameClick} />}
    </QueryClientProvider>
  )
}

export default App
