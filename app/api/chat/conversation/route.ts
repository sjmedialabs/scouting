import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/auth/jwt";
import { Conversation } from "@/models/Message";
import Proposal from "@/models/Proposal";
import Seeker from "@/models/Seeker";
import Provider from "@/models/Provider";

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectToDatabase()

    const { proposalId } = await request.json()

    if (!mongoose.Types.ObjectId.isValid(proposalId)) {
      return NextResponse.json({ error: "Invalid proposalId" }, { status: 400 })
    }

    const proposal = await Proposal.findById(proposalId)
    if (
  !proposal
) {
  return NextResponse.json(
    { error: "Proposal not allowed for conversation" },
    { status: 403 }
  )
}


    // ✅ SORT participants (CRITICAL)
    const participants = [
      proposal.clientId.toString(),
      proposal.agencyId.toString(),
    ].sort()

    let conversation = await Conversation.findOne({ participants })

    if (!conversation) {
      conversation = await Conversation.create({
        participants,
        proposalIds: [proposal._id],
        projectIds: [proposal.requirementId],
        unreadCount: {
          [proposal.clientId.toString()]: 0,
          [proposal.agencyId.toString()]: 0,
        },
      })
    } else {
      // ✅ Attach proposal if not already linked
      if (!conversation.proposalIds.some(id => id.equals(proposal._id))) {
        conversation.proposalIds.push(proposal._id)
        conversation.projectIds.push(proposal.requirementId)
        await conversation.save()
      }
    }

    return NextResponse.json({ conversationId: conversation._id })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Failed to create conversation" },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const conversations = await Conversation.find({
      participants: user.userId,
      isActive: true,
    })
      .sort({ lastMessageAt: -1 })
      .lean();

    const otherUserIds = conversations.map((c) =>
      c.participants.find((id) => id.toString() !== user.userId),
    );

    const providers = await Provider.find({ userId: { $in: otherUserIds } })
      .select("userId name logo")
      .lean();

    const seekers = await Seeker.find({ userId: { $in: otherUserIds } })
      .select("userId name image")
      .lean();

    const userMap = new Map();

    providers.forEach((p) =>
      userMap.set(p.userId.toString(), {
        name: p.name,
        image: p.logo,
        role: "PROVIDER",
      }),
    );

    seekers.forEach((s) =>
      userMap.set(s.userId.toString(), {
        name: s.name,
        image: s.image,
        role: "SEEKER",
      }),
    );

    return NextResponse.json({
      conversations: conversations.map((c) => {
        const otherUserId = c.participants.find(
          (id) => id.toString() !== user.userId,
        );

        return {
          conversationId: c._id,
          lastMessage: c.lastMessage,
          lastMessageAt: c.lastMessageAt,
          unreadCount: c.unreadCount?.[user.userId.toString()] ?? 0,
          participant: userMap.get(otherUserId?.toString()),
          participantsAre: c.participants,
        };
      }),
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch conversations" },
      { status: 500 },
    );
  }
}
