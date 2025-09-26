import type { DefaultEventsMap } from '@socket.io/component-emitter';
import { io, Socket } from 'socket.io-client'

export let socket: Socket<DefaultEventsMap, DefaultEventsMap>;

if (process.env.NODE_ENV === 'development') {
  socket = io("http://localhost:4000")
} else {
  socket = io()
}
