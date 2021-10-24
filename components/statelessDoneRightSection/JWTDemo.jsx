import { useSession } from '@clerk/nextjs';
import React from 'react';
import { Carousel } from 'react-responsive-carousel';

import { TokenRenderer } from './TokenRenderer';

function useInterval(callback, delay) {
  const savedCallback = React.useRef(callback);

  // Remember the latest callback if it changes.
  React.useLayoutEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  React.useEffect(() => {
    // Don't schedule if no delay is specified.
    if (!delay) {
      return;
    }

    const id = setInterval(() => savedCallback.current(), delay);

    return () => clearInterval(id);
  }, [delay]);
}

export const JWTDemo = () => {
  const { getToken } = useSession();

  // setBackTo0 hacks the carousel so additional tokens
  // come in from the left
  const [time, setTime] = React.useState(new Date().getTime());
  const [actuallyActive, setActuallyActive] = React.useState(0);
  const [tokens, setTokens] = React.useState({
    list: [],
    active: null,
    setBackTo0: false,
  });

  useInterval(async () => {
    const token = await getToken();
    if (tokens.list[0] !== token) {
      const newActive = tokens.list.length !== 0 ? actuallyActive + 1 : 0;
      setTokens({
        list: [token, ...tokens.list],
        active: newActive,
        setBackTo0: newActive === 1,
      });
      setActuallyActive(newActive === 1 ? 0 : newActive);
    }
    setTime(new Date().getTime());
  }, 100);

  React.useEffect(() => {
    if (tokens.setBackTo0) {
      setTokens({
        list: tokens.list,
        active: 0,
        setBackTo0: false,
      });
    }
  }, [tokens]);

  const total = tokens.list.length;
  if (total === 0) {
    return null;
  }

  return (
    <>
      <div className='-mx-2'>
        <Carousel
          key={`car` + tokens.list.length}
          selectedItem={tokens.active}
          onChange={index => {
            setActuallyActive(index);
          }}
          showIndicators={false}
          showThumbs={false}
          showStatus={false}
        >
          {tokens.list.map((token, index) => (
            <TokenRenderer
              key={token}
              token={token}
              index={index}
              total={total}
              time={time}
            />
          ))}
        </Carousel>
      </div>
      {total > 1 && (
        <div className='text-right text-gray-500'>
          {total} JWTs generated since page load
        </div>
      )}
      {total === 1 && (
        <div className='text-right text-gray-500'>
          1 JWT generated since page load
        </div>
      )}
    </>
  );
};
