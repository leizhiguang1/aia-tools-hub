import { createId } from "@paralleldrive/cuid2";
import { recordVote, getToolVoteCount } from "@/db/queries";
import { getOrCreateVoterId, setVoterCookie, computeVoterHash } from "@/lib/voter";

export async function POST(request: Request) {
  try {
    const { toolId } = await request.json();
    if (!toolId || typeof toolId !== "string") {
      return Response.json({ error: "toolId is required" }, { status: 400 });
    }

    const { voterId, isNew } = await getOrCreateVoterId();
    const voterHash = await computeVoterHash(voterId, toolId);
    const success = await recordVote(createId(), toolId, voterHash);
    const voteCount = await getToolVoteCount(toolId);

    const response = Response.json({
      success,
      already_voted: !success,
      vote_count: voteCount,
    });

    if (isNew) {
      return setVoterCookie(response, voterId);
    }
    return response;
  } catch {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
