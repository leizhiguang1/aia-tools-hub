import { cookies } from "next/headers";
import { createId } from "@paralleldrive/cuid2";

const COOKIE_NAME = "voter_id";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

/** Read or create a voter ID cookie. Returns the voter ID. */
export async function getOrCreateVoterId(): Promise<{ voterId: string; isNew: boolean }> {
  const cookieStore = await cookies();
  const existing = cookieStore.get(COOKIE_NAME)?.value;
  if (existing) return { voterId: existing, isNew: false };
  return { voterId: createId(), isNew: true };
}

/** Set the voter_id cookie on a Response. */
export function setVoterCookie(response: Response, voterId: string): Response {
  response.headers.append(
    "Set-Cookie",
    `${COOKIE_NAME}=${voterId}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${COOKIE_MAX_AGE}`
  );
  return response;
}

/** Compute a SHA-256 hash of voterId + toolId for dedup. */
export async function computeVoterHash(voterId: string, toolId: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(voterId + toolId);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
