import React from 'react';

export const useForceRender = (delay = 1) => {
  const [s, ss] = React.useState(0);
  React.useEffect(() => {
    const id = setInterval(() => ss(s + 1), delay);
    return () => clearInterval(id);
  });
};
