import { requireSession } from "../../../utils/edge";

// The handler should return a Response object
const handler = async (evt) => {
  return new Response(
    JSON.stringify({
      ...evt.request.session,
    }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
};

export default requireSession(handler);
