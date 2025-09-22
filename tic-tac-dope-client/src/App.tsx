import { useState } from "react"
import { initialGameState, makeMove } from "./tictacdope"


function App() {
  const [gameState, setGameState] = useState(initialGameState)

  const handleClick = ({ row, column }: { row: number, column: number }) => {
    if(gameState.winner) {
        return true
    }
    const newGameState = makeMove(gameState, row, column)
    setGameState(newGameState)
  }

  const handleReset = () => {
    setGameState({
      board: [
        [null, null, null],
        [null, null, null],
        [null, null, null]
      ],
      winner: null,
      currentPlayer: "X",
      stalemate: false
    })
  }


  const ResetButton = () => (
    <button className="bg-green-800 mb-10 p-10 text-white font-bold" onClick={handleReset}>PLAY AGAIN</button>
  )

  interface CellProps extends React.PropsWithChildren {
    onClick: () => true | undefined
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
