import { requireSession } from "../../../utils/edge";
import { withTimer, endTimer, timerResult } from "../../../utils/timer";

// The handler should return a Response object
const handler = async (evt) => {
  endTimer(evt);

  return new Response(
    JSON.stringify({
      ...evt.request.session,
      ...timerResult(evt),
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};

export default withTimer(requireSession(handler));
