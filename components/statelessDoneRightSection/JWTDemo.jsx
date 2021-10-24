import React from 'react';
import { useSession } from '@clerk/nextjs';
import { Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { TokenCard } from './TokenCard';

function useInterval(callback, delay) {
  const savedCallback = React.useRef(callback);

  React.useLayoutEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  React.useEffect(() => {
    if (!delay) {
      return;
    }
    const id = setInterval(() => savedCallback.current(), delay);
    return () => clearInterval(id);
  }, [delay]);
}

export const JWTDemo = () => {
  const session = useSession();
  const [swiperRef, setSwiperRef] = React.useState(null);
  const [tokens, setTokens] = React.useState([]);

  const prependAndSlideToStart = () => {
    if (!swiperRef) {
      return;
    }
    swiperRef.slideTo(1, 0);
    swiperRef.update();
    swiperRef.slideTo(0);
  };

  const getToken = async () => {
    const token = await session.getToken();
    if (tokens[0] !== token) {
      setTokens([token, ...tokens]);
      prependAndSlideToStart();
    }
  };

  React.useEffect(() => {
    getToken();
  }, []);

  useInterval(async () => {
    void getToken();
  }, 1000);

  const tokenCount = tokens.length;
  const generatedTokensText = `${tokenCount} ${
    tokenCount === 1 ? 'JWT' : 'JWTs'
  } generated since page load`;

  return (
    <>
      <div className='-mx-2'>
        <Swiper
          modules={[Pagination]}
          pagination={{
            dynamicBullets: true,
            horizontalClass: 'cl-swiper-pagination',
          }}
          onSwiper={setSwiperRef}
          slidesPerView={1}
        >
          {tokens.map((token, index) => (
            <SwiperSlide key={token}>
              <TokenCard token={token} index={index} total={tokenCount} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div className='text-right text-gray-500 -mt-7'>
        {generatedTokensText}
      </div>
    </>
  );
};
