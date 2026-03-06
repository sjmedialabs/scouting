import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    // TODO: Replace with actual database query
    // For now, return mock data
    const conversations = [
      {
        id: "john-doe",
        name: "John Doe",
        initials: "JD",
        lastMessage: "Thanks for the proposal. When can we start?",
        lastMessageTime: new Date().toISOString(),
        project: "E-commerce",
        unreadCount: 1,
        color: "bg-blue-500",
        status: "active",
      },
      {
        id: "sarah-wilson",
        name: "Sarah Wilson",
        initials: "SW",
        lastMessage: "Could you provide more details about the timeline?",
        lastMessageTime: new Date(Date.now() - 3600000).toISOString(),
        project: "Mobile App",
        unreadCount: 1,
        color: "bg-purple-500",
        status: "active",
      },
    ]

    return NextResponse.json({ conversations })
  } catch (error) {
    console.error("Error fetching conversations:", error)
    return NextResponse.json({ error: "Failed to fetch conversations" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { clientName, projectType, initialMessage } = body

    // Validate required fields
    if (!clientName || !projectType || !initialMessage) {
      return NextResponse.json(
        { error: "Missing required fields: clientName, projectType, initialMessage" },
        { status: 400 },
      )
    }

    // TODO: Create new conversation in database
    const newConversation = {
      id: `${clientName.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`,
      name: clientName,
      initials: clientName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2),
      lastMessage: initialMessage,
      lastMessageTime: new Date().toISOString(),
      project: projectType,
      unreadCount: 1,
      color: "bg-blue-500",
      status: "active",
    }

    return NextResponse.json({
      success: true,
      conversation: newConversation,
    })
  } catch (error) {
    console.error("Error creating conversation:", error)
    return NextResponse.json({ error: "Failed to create conversation" }, { status: 500 })
  }
}
