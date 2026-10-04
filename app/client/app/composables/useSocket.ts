import { io, type Socket } from 'socket.io-client'

let socket: Socket | null = null

// один сокет на все приложение, переподключается при смене токена (логин/логаут)
export const useSocket = () => {
  const config = useRuntimeConfig()
  const auth = useAuthStore()

  const connect = () => {
    if (!auth.token) return null
    if (socket) socket.disconnect()
    socket = io(config.public.wsBase, { auth: { token: auth.token }, transports: ['websocket', 'polling'] })
    return socket
  }

  const disconnect = () => {
    socket?.disconnect()
    socket = null
  }

  const get = () => socket

  return { connect, disconnect, get }
}
