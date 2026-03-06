import mongoose, { Schema, type Document, type Model } from "mongoose"

export interface IMessage extends Document {
  _id: mongoose.Types.ObjectId
  conversationId: mongoose.Types.ObjectId
  senderId: mongoose.Types.ObjectId
  receiverId: mongoose.Types.ObjectId
  content: string
  attachments?: string[]
  senderType:string
  messageType:string
  isRead: boolean
  readAt?: Date
  createdAt: Date
  updatedAt: Date
}

export interface IConversation extends Document {
  _id: mongoose.Types.ObjectId
  participants: mongoose.Types.ObjectId[]
  proposalIds?: mongoose.Types.ObjectId[]
  projectIds?: mongoose.Types.ObjectId[]
  lastMessage?: string
  lastMessageAt?: Date
  unreadCount: Map<string, number>
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const MessageSchema = new Schema<IMessage>(
  {
    conversationId: { type: Schema.Types.ObjectId, ref: "Conversation", required: true },

    senderId: { type: Schema.Types.ObjectId, required: true },
    senderType: { type: String, enum: ["PROVIDER", "SEEKER"], required: true },

    receiverId: { type: Schema.Types.ObjectId, required: true },

    content: { type: String },
    messageType: {
      type: String,
      enum: ["TEXT", "IMAGE", "FILE"],
      default: "TEXT",
    },

    attachments: [{ type: String }],
    isRead: { type: Boolean, default: false },
    readAt: { type: Date },
  },
  { timestamps: true }
)


const ConversationSchema = new Schema<IConversation>(
  {
    participants: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],

    proposalIds: [{ type: Schema.Types.ObjectId, ref: "Proposal" }],
    projectIds: [{ type: Schema.Types.ObjectId, ref: "Requirement" }],

    lastMessage: { type: String },
    lastMessageAt: { type: Date },

    unreadCount: { type: Map, of: Number, default: {} },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
)

ConversationSchema.index(
  { participants: 1 },
  { unique: true }
)


MessageSchema.index({ conversationId: 1, createdAt: -1 })
MessageSchema.index({ senderId: 1 })
MessageSchema.index({ receiverId: 1 })


ConversationSchema.index({ participants: 1 })
ConversationSchema.index({ lastMessageAt: -1 })

export const Message: Model<IMessage> = mongoose.models.Message || mongoose.model<IMessage>("Message", MessageSchema)
export const Conversation: Model<IConversation> =
  mongoose.models.Conversation || mongoose.model<IConversation>("Conversation", ConversationSchema)
 