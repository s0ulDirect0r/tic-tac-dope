import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import type { GameState } from "../../tictacdope";
import { socket } from "../socket";
import { useEffect } from "react";

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
  const moveMutation = useMutation({
    mutationFn: (moveData: moveData) => axios.post(`/move/${props.id}`, moveData).then((res) => {
      console.log("mutation response: ", res)
      return res.data
    })
  })

  const queryClient = useQueryClient()
  useEffect(() => {
    socket.emit('join-game', props.id)

    socket.on('move', (gameState) => {
      console.log('move received')
      // this is a terrible hack, have to find a way to make sure emit sockets are opened
      // and attached to a specific game
        return queryClient.setQueryData(['gameState', props.id], gameState)
    })

    return () => {
      socket.emit('leave-game', props.id)
      socket.off('move')
    }
  }, [queryClient, props.id])

  // why is this being called multiple times?
  const query = useQuery({
    queryKey: ["gameState", props.id],
    queryFn: () => axios.get(`/game/${props.id}`).then((res) => res.data)
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
    <div onClick={props.onClick} className="bg-green-500 flex flex-col size-24 md:size-40 justify-center items-center rounded-md aspect-square p-2 sm:p-8 text-7xl sm:text-9xl text-white font-bold">
      <p>{props.children}</p>
    </div>
  )

  return (
    <>
      <div className="m-10 flex flex-col justify-center items-center">
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
        <div className='content-center grid grid-cols-3 grid-rows-3 gap-3 max-w-sm sm:max-w-3xl'>
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