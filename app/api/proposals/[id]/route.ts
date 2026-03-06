import { type NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Proposal from "@/models/Proposal";
import Project from "@/models/Project";
import Provider from "@/models/Provider";
import Seeker from "@/models/Seeker";
import { getCurrentUser } from "@/lib/auth/jwt";
import mongoose from "mongoose";
import Requirement from "@/models/Requirement";
import Notification from "@/models/Notification";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    await connectToDatabase();

    const { id } = await params;

    // ✅ Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const objectId = new mongoose.Types.ObjectId(id);
    console.log("Incoming ID:", id);
    console.log("Is valid ObjectId:", mongoose.Types.ObjectId.isValid(id));

    // ✅ Fetch ALL matching proposals
    const proposals = await Proposal.find({
      $or: [
        { _id: objectId },
        { requirementId: objectId },
        { clientId: objectId },
        { agencyId: objectId },
      ],
    })
      .populate({
        path: "requirementId",
        select:
          "title category description budgetMin budgetMax timeline documentUrl status createdAt",
      })
      .lean();

    if (!proposals.length) {
      return NextResponse.json(
        { error: "No proposals found" },
        { status: 404 },
      );
    }

    //getting unique agency ids from proposals
    const agencyUserIds = [
      ...new Set(proposals.map((p) => p.agencyId.toString())),
    ];

    const providers = await Provider.find({
      userId: { $in: agencyUserIds },
    })
      .select(
        "userId name logo coverImage rating reviewCount location services technologies",
      )
      .lean();

    const providerMap = new Map(providers.map((p) => [p.userId.toString(), p]));

    // ✅ Mark proposals as viewed if client
    
    if (user.role === "client") {
            await Proposal.updateOne(
          {
            _id: new mongoose.Types.ObjectId(id),
            clientViewed: false,
          },
          {
            $set: {
              clientViewed: true,
              clientViewedAt: new Date(),
            },
          }
        )
    }

    // ✅ Format response
    return NextResponse.json({
      count: proposals.length,
      proposals: proposals.map((p) => ({
        // Proposal details
        id: p._id.toString(),
        coverLetter: p.coverLetter,
        proposalDescription: p.proposalDescription,
        proposedBudget: p.proposedBudget,
        proposedTimeline: p.proposedTimeline,
        milestones: p.milestones,
        status: p.status,

        createdAt: p.createdAt,
        updatedAt: p.updatedAt,

        // Requirement details
        requirement: p.requirementId && {
          id: p.requirementId._id.toString(),
          title: p.requirementId.title,
          category: p.requirementId.category,
          description: p.requirementId.description,
          budgetMin: p.requirementId.budgetMin,
          budgetMax: p.requirementId.budgetMax,
          timeline: p.requirementId.timeline,
          documentUrl: p.requirementId.documentUrl,
        },

        // ✅ Provider details (joined manually)
        agency: providerMap.get(p.agencyId.toString()) || null,
      })),
    });
  } catch (error) {
    console.error("Error fetching proposals:", error);
    return NextResponse.json(
      { error: "Failed to fetch proposals" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    await connectToDatabase();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid proposal ID" },
        { status: 400 },
      );
    }

    const proposal = await Proposal.findById(id).populate(
      "requirementId",
      "clientId",
    );

    if (!proposal) {
      return NextResponse.json(
        { error: "Proposal not found" },
        { status: 404 },
      );
    }

    const body = await request.json();
    const updates: any = {};

    const seeker =
      user.role === "client"
        ? await Seeker.findOne({ userId: user.userId })
        : await Provider.findOne({ userId: user.userId });
    const projectClient = await Requirement.findById(proposal.requirementId);

    // Agency can update their proposal content
    if (user.role === "agency") {
      const provider = await Provider.findOne({ userId: user.userId });
      if (!provider || proposal.agencyId.toString() !== user.userId) {
        return NextResponse.json({ error: "Not authorized" }, { status: 403 });
      }

      if (body.coverLetter) updates.coverLetter = body.coverLetter;
      if (body.proposedBudget) updates.proposedBudget = body.proposedBudget;
      if (body.proposedTimeline)
        updates.proposedTimeline = body.proposedTimeline;
      if (body.milestones) updates.milestones = body.milestones;
      if (body.proposalDescription)
        updates.proposalDescription = body.proposalDescription;
      if (body.status === "withdrawn") updates.status = "withdrawn";
      if (body.status === "completed") {
        updates.status = "completed";
        //for the posted requirement status update
        await Requirement.findByIdAndUpdate(
          proposal.requirementId,
          { status: "Closed" },
          { new: true },
        );
      }
      console.log("----Agency updates::", updates);
    }

    // Client can update proposal status
    if (user.role === "client") {
      const project = proposal.requirementId as any;
      if (project.clientId.toString() !== user.userId) {
        return NextResponse.json({ error: "Not authorized" }, { status: 403 });
      }

      if (
        body.status &&
        ["viewed", "shortlisted", "accepted", "rejected","negotation"].includes(body.status)
      ) {
        updates.status = body.status;
        updates.clientResponded = true;
        updates.clientRespondedAt = new Date();
        //for the posted requirement status update
        if (body.status.toLocaleLowerCase() === "shortlisted") {
          await Requirement.findByIdAndUpdate(
            proposal.requirementId,
            { status: body.status },
            { new: true },
          );
        }
        if (body.status.toLocaleLowerCase() === "accepted") {
          console.log("----Accepted proposal:::");
          const requirementStaus = await Requirement.findById(
            proposal.requirementId,
          );
          if (requirementStaus?.status !== "Allocated") {
            await Requirement.findByIdAndUpdate(
              proposal.requirementId,
              { status: "Allocated", allocatedToId: proposal.agencyId },
              { new: true },
            );
          } else {
            return NextResponse.json(
              { error: "Requirement already allocated" },
              { status: 400 },
            );
          }
          //it will automatically reject all the proposal whcih are recieved for this requirement once one proposal is accepted
          await Proposal.updateMany(
            {
              requirementId:proposal.requirementId,
              _id: { $ne:id } // exclude accepted proposal
            },
            {
              $set: { status: "rejected" }
            }
          )
        }
        //Notification creation
        await Notification.create({
          userId: proposal?.agencyId,
          triggeredBy: user.userId,
          title: `Proposal ${body.status}`,
          message: `${seeker?.companyName || seeker?.name} ${body.status} your proposal for the ${projectClient?.title} project.`,
          type: body.status,
          userRole: "client",
          linkUrl: `/agency/dashboard/proposals`,
          sourceId: proposal._id,
        });
      }

      if (body.conversationStarted !== undefined) {
        updates.conversationStarted = body.conversationStarted;
      }

      if (body.clientViewed !== undefined) {
        console.log("-------Entered---------");
        updates.clientViewed = body.clientViewed;
        updates.clientViewedAt = new Date();
      }

      if (body.rating) {
        updates.rating = body.rating;
      }
    }

    // Admin can update anything
    if (user.role === "admin") {
      Object.assign(updates, body);
    }

    const updated = await Proposal.findByIdAndUpdate(id, updates, {
      new: true,
    });
    // console.log("--------updated proposal:::",updated)

    //  console.log("----project in the put---",project)

    //  if(user.role==="client"){
    //   seeker= await Seeker.findOne({ userId: user.userId })
    //  }
    //  if(user.role==="agency"){
    //   seeker=await Provider.findOne({ userId: user.userId })
    //  }

    return NextResponse.json({
      success: true,
      proposal: {
        id: updated!._id.toString(),
        status: updated!.status,
        clientViewed: updated!.clientViewed,
        clientResponded: updated!.clientResponded,
        conversationStarted: updated!.conversationStarted,
        updatedAt: updated!.updatedAt,
      },
    });
  } catch (error) {
    console.error("Error updating proposal:", error);
    return NextResponse.json(
      { error: "Failed to update proposal" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    await connectToDatabase();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid proposal ID" },
        { status: 400 },
      );
    }

    const proposal = await Proposal.findById(id);

    if (!proposal) {
      return NextResponse.json(
        { error: "Proposal not found" },
        { status: 404 },
      );
    }

    // Only the agency that submitted or admin can delete
    if (user.role === "agency") {
      const provider = await Provider.findOne({ userId: user.userId });
      if (
        !provider ||
        proposal.providerId.toString() !== provider._id.toString()
      ) {
        return NextResponse.json({ error: "Not authorized" }, { status: 403 });
      }
    } else if (user.role !== "admin") {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    // Update project proposal count
    await Project.findByIdAndUpdate(proposal.projectId, {
      $inc: { proposalCount: -1 },
    });

    // Delete proposal
    await Proposal.findByIdAndDelete(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting proposal:", error);
    return NextResponse.json(
      { error: "Failed to delete proposal" },
      { status: 500 },
    );
  }
}
