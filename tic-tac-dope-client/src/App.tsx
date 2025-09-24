import { type GameState } from "../tictacdope"
import { QueryClient, QueryClientProvider, useMutation, useQuery } from "@tanstack/react-query"
import axios from 'axios'

const queryClient = new QueryClient()
interface moveData {
  gameState: GameState;
  row: number;
  column: number;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Game />
    </QueryClientProvider>
  )
}

function Game() {
  const query = useQuery({
    queryKey: ["gameState"],
    queryFn: () => axios.get("/game").then((res) => res.data)
  })

  const moveMutation = useMutation({
    mutationFn: (moveData: moveData) => axios.post("/move", moveData).then(res => res.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['gameState']})
  })

  const resetMutation = useMutation({
    mutationFn: (gameOver: boolean) => axios.post("/reset", gameOver).then(res => res.data),
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

  const handleReset = () => {
    return resetMutation.mutate(true)
  }


  const ResetButton = () => (
    <button onClick={handleReset} className="bg-green-800 mb-10 p-10 text-white font-bold">PLAY AGAIN</button>
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
        <div className="m-11 mt-20 mb-20">
          <h1 className="text-center text-white font-bold text-7xl">Tic-Tac-Dope</h1>
        </div>
        {gameState.stalemate &&
          <div className="flex flex-col items-center">
            <h1 className="text-center mb-10 font-bold text-5xl text-white">GAME OVER, IT'S A STALEMATE!</h1>
            <ResetButton />
          </div>
        }
        {gameState.winner && 
          <div className="flex flex-col items-center">
            <h1 className="text-center mb-10 font-bold text-5xl text-white">GAME OVER {gameState.winner} WINS!!</h1>
            <ResetButton />
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
