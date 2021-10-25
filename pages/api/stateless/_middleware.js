import { requireSession } from '../../../utils/edge';
import { withTimer, endTimer, timerResult } from '../../../utils/timer';
import { shim } from '../../../utils/middlewareShim';

// The handler should return a Response object
const handler = async req => {
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
