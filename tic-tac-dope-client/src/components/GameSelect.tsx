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

export default GameSelect