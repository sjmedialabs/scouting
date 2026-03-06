import http from "http"
import next from "next"
import { Server } from "socket.io"

const dev = process.env.NODE_ENV !== "production"
const app = next({ dev })
const handle = app.getRequestHandler()
const PORT = Number(process.env.PORT) || 3001

app.prepare().then(() => {
  const server = http.createServer((req, res) => {
    handle(req, res)
  })

  const io = new Server(server, {
    path: "/socket.io",
  })

  io.on("connection", (socket) => {
    console.log("✅ Socket connected:", socket.id)

    socket.on("join-conversation", (conversationId) => {
      socket.join(conversationId)
    })

    // THIS IS IMPORTANT
    socket.on("send-message", (message) => {
      // broadcast to everyone in the conversation
      io.to(message.conversationId).emit("receive-message", message)
    })
  })

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on port ${PORT}`)
  })
})
