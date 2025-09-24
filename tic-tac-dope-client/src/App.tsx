import { type GameState } from "../tictacdope"
import { useState } from "react"
import { QueryClient, QueryClientProvider, useMutation, useQuery } from "@tanstack/react-query"
import axios from 'axios'

const queryClient = new QueryClient()
interface moveData {
  gameState: GameState;
  row: number;
  column: number;
}

interface GameSelectProps {
  onClick: (id: string) => void;
}

const GameSelect = (props: GameSelectProps) => {
  const query = useQuery({
    queryKey: ["gamesList"],
    queryFn: () => axios.get(`/games`).then((res) => res.data)
  })

  const createGameMutation = useMutation({
    mutationFn: () => axios.post('/create').then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gamesList'] })
    }
  })

  const handleCreateGameClick = () => {
    return createGameMutation.mutate()
  }

  if (query.isLoading) return <div>Loading...</div>
  if (query.error) return <div>Error loading games</div>
  if (!query.data) return <div>No game data</div>

  const gamesList: GameState[] = query.data
  console.log(gamesList)

  return (
    <div className="flex flex-col m-8 justify-around gap-4">
      <div>
        <button onClick={handleCreateGameClick} className="bg-green-500 text-white border-green-500">Create Game</button>
      </div>
      {gamesList.map(game => {
          console.log(game)
          return <button className="max-w-2xl bg-green-400 border-green-400 text-white" onClick={() => props.onClick(game.id)}>Game {game.id}</button>
      })}
    </div>
  )
}

function App() {
  const [selectedGame, setSelectedGame] = useState<string | null>(null)
 
  const handleGameClick = (id: string) => {
    setSelectedGame(id)
  }

  const handleReturnToSelectClick = () => {
    setSelectedGame(null)
  }


  return (
    <QueryClientProvider client={queryClient}>
      {selectedGame ? <Game id={selectedGame} returnClick={handleReturnToSelectClick} /> : <GameSelect onClick={handleGameClick} />}
    </QueryClientProvider>
  )
}

interface GameProps {
  id: string;
  returnClick: () => void
}

function Game(props: GameProps) {
  const query = useQuery({
    queryKey: ["gameState"],
    queryFn: () => axios.get(`/game/${props.id}`).then((res) => res.data)
  })

  const moveMutation = useMutation({
    mutationFn: (moveData: moveData) => axios.post(`/move/${props.id}`, moveData).then(res => res.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['gameState']})
  })

  if (query.isLoading) return <div>Loading...</div>
  if (query.error) return <div>Error loading game</div>
  if (!query.data) return <div>No game data</div>

  const gameState = query.data as GameState;

  const handleClick = async ({ row, column }: { row: number, column: number }) => {
    if(gameState.winner) {
        return true
    }
    const moveData = {
      gameState,
      row,
      column
    }
    console.log('mutating!')
    return moveMutation.mutate(moveData)
  }

  const handleReturn = () => {
    return props.returnClick()
  }


  const ReturnButton = () => (
    <button onClick={handleReturn} className="bg-green-800 mb-10 p-10 text-white font-bold">PLAY AGAIN</button>
  )

  const ReturnToGameSelectButton = () => (
    <button onClick={handleReturn} className="rounded-md bg-green-800 max-w-xl mb-4 p-4 text-white font-bold">return to game select</button>
  )

  interface CellProps extends React.PropsWithChildren {
    onClick: () => Promise<true | void>
  }

  const Cell = (props: CellProps) => (
    <div onClick={props.onClick} className="bg-green-500 p-8 text-7xl text-white font-bold text-center">{props.children}</div>
  )
  
  return (
    <>
      <div className="m-10">
        <div className="m-11 mt-20 mb-20 flex flex-col items-center gap-4">
          <h1 className="text-center text-white font-bold text-7xl">Tic-Tac-Dope</h1>
          <ReturnToGameSelectButton />
        </div>
        {gameState.stalemate &&
          <div className="flex flex-col items-center">
            <h1 className="text-center mb-10 font-bold text-5xl text-white">GAME OVER, IT'S A STALEMATE!</h1>
            <ReturnButton />
          </div>
        }
        {gameState.winner && 
          <div className="flex flex-col items-center">
            <h1 className="text-center mb-10 font-bold text-5xl text-white">GAME OVER {gameState.winner} WINS!!</h1>
            <ReturnButton />
          </div>   
        }
        <div className='m-auto content-center grid grid-cols-3 grid-rows-3 gap-3'>
          {gameState.board.map((row, rowIndex) => row.map((cell, cellIndex) => <Cell key={`${rowIndex} ${cellIndex}`} onClick={() => handleClick({ row: rowIndex, column: cellIndex })}>{cell}</Cell>))}
        </div>
      </div>
    </>
  )
}

export default App
