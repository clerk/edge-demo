// This middleware records the authentication speed
// of the stateless and stateful strategies
//
// If you want to see how to authenticate in middleware
// Clerk, please reference
//   /pages/api/stateless/_middleware.js
//   /pages/api/stateful/_middleware.js

import { NextResponse } from "next/server";

export default function authTimer(evt) {
  const withAuthSpeed = async function () {
    // If the timer is started, proceed to NextRequest.next();
    if (evt.request.headers.get("X-Timer")) {
      return NextResponse.next();
    }

    // No timer set, set one and re-request via fetch()
    evt.request.headers.set("X-Timer", "1");
    const timerStart = new Date().getTime();
    const res = await fetch(
      new URL(evt.request.nextUrl, evt.request.headers.get("referer")),
      {
        headers: evt.request.headers,
      }
    );
    const timerEnd = new Date().getTime();
    const data = await res.json();

    return new Response(
      JSON.stringify({
        ...data,
        authenticationTime: timerEnd - timerStart,
      })
    );
  };
  evt.respondWith(withAuthSpeed());
}
