import { requireSession } from '../../../utils/edge';
import { withTimer, endTimer, timerResult } from '../../../utils/timer';
import { shim } from '../../../utils/middlewareShim';

// The handler should return a Response object
const handler = async req => {
  // The session is already verified, but we want
  // to double-check with Clerk's API to ensure
  // it hasn't been revoked in the last minute
  try {
    const reverify = await req.session.verifyWithNetwork();
  } catch (error) {
    return new Response('Forbidden', { status: 403 });
  }

  endTimer(req);

  return new Response(
    JSON.stringify({
      ...req.session,
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

export default shim(withTimer(requireSession(handler)));
