import { withAuth } from '@clerk/nextjs/edge';
import { withTimer, endTimer, timerResult } from '../../../utils/timer';

// The handler should return a Response object
const handler = async req => {
  // The session is already verified, but we want
  // to double-check with Clerk's API to ensure
  // it hasn't been revoked in the last minute
  try {
    const token = req.headers.get('authorization') || req.cookies['__session'];
    await verifyWithNetwork(req.auth.sessionId, token);
  } catch (error) {
    return new Response('Forbidden', { status: 403 });
  }

  endTimer(req);

  return new Response(
    JSON.stringify({
      userId: req.auth.userId,
      ...timerResult(req),
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
};

async function verifyWithNetwork(sessionId, token) {
  const res = await fetch(
    `https://api.clerk.dev/v1/sessions/${sessionId}/verify`,
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Bearer ${process.env.CLERK_API_KEY}`,
      },
      method: 'post',
      body: `token=${encodeURIComponent(token)}`,
    },
  );
  if (res.status !== 200) {
    throw new Error('verifyWithNetwork failed');
  }
  return res;
}

export default withTimer(withAuth(handler));
