import { io } from 'socket.io-client'

const URL = process.env.NODE_ENV === 'production' ? 'https://tic-tac-dope-client.fly.dev/' : 'http://localhost:3000'

export const socket = io(URL)