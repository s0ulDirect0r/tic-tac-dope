import { useState } from "react"
import { initialGameState, makeMove, type GameState } from "./tictacdope"

function App() {
  const [gameState, setGameState] = useState(initialGameState)

  const handleClick = ({ row, column }: { row: number, column: number }) => {
    if(gameState.winner) {
        return true
    }
    console.log(gameState)
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
      currentPlayer: "X"
    })
  }

  const board = gameState.board

  return (
    <>
      <div className="m-10">
        <div className="m-11 mt-20 mb-20">
          <h1 className="text-center text-white font-bold text-7xl">Tic-Tac-Dope</h1>
        </div>
        {gameState.winner && 
          <div className="flex flex-col items-center">
            <h1 className="text-center mb-10 font-bold text-5xl text-white">GAME OVER {gameState.winner} WINS!!</h1>
            <button className="bg-green-800 mb-10 p-10 text-white font-bold" onClick={handleReset}>PLAY AGAIN</button>
          </div>   
        }
        <div className='m-auto content-center grid grid-cols-3 grid-rows-3 gap-3'>
            <div className="bg-green-500 p-8 text-7xl text-white font-bold text-center" onClick={() => handleClick({row: 0, column: 0})}>{board[0][0]}</div>
            <div className="bg-green-500 p-8 text-7xl text-white font-bold text-center" onClick={() => handleClick({row: 0, column: 1})}>{board[0][1]}</div>
            <div className="bg-green-500 p-8 text-7xl text-white font-bold text-center" onClick={() => handleClick({row: 0, column: 2})}>{board[0][2]}</div>
            <div className="bg-green-500 p-8 text-7xl text-white font-bold text-center" onClick={() => handleClick({row: 1, column: 0})}>{board[1][0]}</div>
            <div className="bg-green-500 p-8 text-7xl text-white font-bold text-center" onClick={() => handleClick({row: 1, column: 1})}>{board[1][1]}</div>
            <div className="bg-green-500 p-8 text-7xl text-white font-bold text-center" onClick={() => handleClick({row: 1, column: 2})}>{board[1][2]}</div>
            <div className="bg-green-500 p-8 text-7xl text-white font-bold text-center" onClick={() => handleClick({row: 2, column: 0})}>{board[2][0]}</div>
            <div className="bg-green-500 p-8 text-7xl text-white font-bold text-center" onClick={() => handleClick({row: 2, column: 1})}>{board[2][1]}</div>
            <div className="bg-green-500 p-8 text-7xl text-white font-bold text-center" onClick={() => handleClick({row: 2, column: 2})}>{board[2][2]}</div>
        </div>
      </div>
    </>
  )
}

export default App
