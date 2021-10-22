// Utilities to measure the authentication strategies
export const withTimer = (eventHandler) => {
  return (event) => {
    event.request.startTime = new Date().getTime();
    return eventHandler(event);
  };
};

export const endTimer = (event) => {
  event.request.endTime = new Date().getTime();
};

export const timerResult = (event) => {
  return {
    authenticationTime: event.request.endTime - event.request.startTime,
  };
};
