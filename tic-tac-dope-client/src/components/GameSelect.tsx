import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import type { GameState } from "../../tictacdope"

interface GameSelectProps {
  onClick: (id: string) => void;
}

const GameSelect = (props: GameSelectProps) => {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ["gamesList"],
    queryFn: () => axios.get(`/games`).then((res) => res.data)
  })

  const createGameMutation = useMutation({
    mutationFn: () => axios.post('/create').then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gamesList'] })
    },
    onError: (error) => {
      console.log(error)
    }
  })

  const handleCreateGameClick = () => {
    return createGameMutation.mutate()
  }

  if (query.isLoading) return <div>Loading...</div>
  if (query.error) return <div>Error loading games</div>
  if (!query.data) return <div>No game data</div>

  const gamesList: GameState[] = query.data

  return (
    <div className="flex flex-col flex-wrap m-8 justify-center items-center gap-4">
      <div>
        <button onClick={handleCreateGameClick} className="p-4 rounded-lg bg-green-500 text-white text-2xl border-green-500">Create Game</button>
      </div>
      <div className="content-center grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-[70vh] overflow-y-auto pr-1">
        {gamesList.map(game => {
          if(game.winner || game.stalemate) { return }
          return <button key={game.id} className="w-full p-4 sm:p-5 aspect-square rounded-lg text-lg sm:text-xl bg-green-400 border-green-400 text-white" onClick={() => props.onClick(game.id)}>Game {game.roomNumber}</button>
       })}
      </div>
    </div>
  )
}

export default GameSelect