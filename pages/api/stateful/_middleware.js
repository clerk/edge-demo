import { NextResponse } from "next/server";
import { requireSession } from "../../../utils/edge";

// The handler should return a Response object
const handler = async (evt) => {
  // The session is already verified, but we want
  // to double-check with Clerk's API to ensure
  // it hasn't been revoked in the last minute
  const reverify = await evt.request.session.verifyWithNetwork();

  // Return forbidden if reverification fails
  if (reverify.status !== 200) {
    return new Response(null, { status: 403 });
  }

  return new Response(
    JSON.stringify({
      ...evt.request.session,
    }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
};

export default requireSession(handler);
