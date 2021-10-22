import { NextResponse } from "next/server";
import { withSession } from "../../../utils/edge";

const authTimer = (handler) => {
  return (evt) => {
    evt.request.authStart = new Date().getTime();
    return handler(evt);
  };
};

export default authTimer(
  withSession(async (evt) => {
    if (evt.request.session) {
      try {
        await evt.request.session.verifyWithNetwork();
      } catch (e) {
        evt.request.session = {};
      }
    }
    const authTime = new Date().getTime() - evt.request.authStart;
    return new Response(
      JSON.stringify({
        ...evt.request.session,
        authenticationTime: authTime,
      }),
      { status: 200 }
    );
  })
);
