import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import type { GameState } from "../../tictacdope";

interface GameProps {
  id: string;
  returnClick: () => void
}

interface moveData {
  gameState: GameState;
  row: number;
  column: number;
}


function Game(props: GameProps) {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ["gameState"],
    queryFn: () => axios.get(`/game/${props.id}`).then((res) => res.data)
  })

  const moveMutation = useMutation({
    mutationFn: (moveData: moveData) => axios.post(`/move/${props.id}`, moveData).then((res) => {
      console.log("mutation response: ", res)
      return res.data
    }),
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
        <div className="m-11 flex flex-col items-center gap-4">
          {(!gameState.winner && !gameState.stalemate) && <ReturnToGameSelectButton />}
        </div>
      </div>
    </>
  )
}

export default Game