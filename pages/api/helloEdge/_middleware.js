import { NextResponse } from "next/server";
import { withSession } from "../../../utils/middleware";

const authTimer = (handler) => {
  return (evt) => {
    evt.request.authStart = new Date().getTime();
    return handler(evt);
  };
};

export default authTimer(
  withSession((evt) => {
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
