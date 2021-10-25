// A simple function to help prepare for the new middleware signature
export const shim = middleware => {
  return event => event.respondWith(middleware(event.request));
};
