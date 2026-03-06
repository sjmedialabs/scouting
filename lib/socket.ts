import { Server } from "socket.io"

let io: Server | null = null

export function initSocket(server: any) {
  if (!io) {
    io = new Server(server, {
      cors: {
        origin: "*",
      },
    })

    io.on("connection", (socket) => {
      console.log("User connected:", socket.id)

      socket.on("join-conversation", (conversationId) => {
        socket.join(conversationId)
      })

      socket.on("send-message", (message) => {
        socket.to(message.conversationId).emit("receive-message", message)
      })

      socket.on("disconnect", () => {
        console.log("User disconnected")
      })
    })
  }

  return io
}
