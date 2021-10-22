import React from "react";
import { SignedIn, SignedOut, useSession } from "@clerk/clerk-react";
import { SignUpCover } from "../utils/buttons";
import { getVercelRegion } from "../utils/vercelRegion";

import { Carousel } from "react-responsive-carousel";

import {
  GlobeAltIcon,
  LightningBoltIcon,
  MailIcon,
  ScaleIcon,
} from "@heroicons/react/outline";

export default function StatelessDoneRight() {
  return (
    <div className="bg-gray-50 overflow-hidden">
      <div className="relative max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <svg
          className="absolute top-0 left-full transform -translate-x-1/2 -translate-y-3/4 lg:left-auto lg:right-full lg:translate-x-2/3 lg:translate-y-1/4"
          width={404}
          height={784}
          fill="none"
          viewBox="0 0 404 784"
          aria-hidden="true"
        >
          <defs>
            <pattern
              id="8b1b5f72-e944-4457-af67-0c6d15a99f38"
              x={0}
              y={0}
              width={20}
              height={20}
              patternUnits="userSpaceOnUse"
            >
              <rect
                x={0}
                y={0}
                width={4}
                height={4}
                className="text-gray-200"
                fill="currentColor"
              />
            </pattern>
          </defs>
          <rect
            width={404}
            height={784}
            fill="url(#8b1b5f72-e944-4457-af67-0c6d15a99f38)"
          />
        </svg>

        <div className="relative lg:grid lg:grid-cols-3 lg:gap-x-8">
          <div className="lg:col-span-1">
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Stateless done right
            </h2>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Short-lived and automatically refreshing JWTs provide simple,
              robust security
            </p>
          </div>
          <div className="lg:col-span-2">
            <div className="relative lg:grid lg:grid-cols-2 lg:gap-x-8 mb-4">
              <div className="lg:col-span-1">
                <div className="flex items-center">
                  <h2 className={`text-gray-900 text-2xl font-semibold mr-2`}>
                    Short-lived
                  </h2>
                </div>
                <p className="mt-1 text-gray-500">
                  Each JWT only lasts 60 seconds. After a session is revoked,
                  new JWTs cannot be generated and the user will be signed out.
                </p>
              </div>
              <div className="lg:col-span-1">
                <div className="flex items-center">
                  <h2 className={`text-gray-900 text-2xl font-semibold mr-2`}>
                    Automatically refreshing
                  </h2>
                </div>
                <p className="mt-1 text-gray-500">
                  Clerk makes security easy. When a JWT nears its expiration,
                  our SDK will automatically generate a new one &ndash; there's
                  no extra work for your team.
                </p>
              </div>
            </div>
            <SignedIn>
              <JWTDemo />
            </SignedIn>
            <SignedOut>
              <JWTMock />
            </SignedOut>
          </div>
        </div>
      </div>
    </div>
  );
}

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

const TokenRender = ({ token, index, time, total }) => {
  const claims = JSON.parse(atob(token.split(".")[1]));
  const percentGone = Math.min(
    1,
    (time - claims.iat * 1000) / (claims.exp * 1000 - claims.iat * 1000)
  );
  const barColor =
    percentGone < 0.5
      ? "bg-green-500"
      : percentGone < 0.6
      ? "bg-yellow-300"
      : percentGone < 0.7
      ? "bg-yellow-400"
      : percentGone < 0.8
      ? "bg-yellow-500"
      : percentGone < 0.9
      ? "bg-yellow-600"
      : "bg-red-600";
  const textColor =
    percentGone < 0.5
      ? "text-green-500"
      : percentGone < 0.6
      ? "text-yellow-300"
      : percentGone < 0.7
      ? "text-yellow-400"
      : percentGone < 0.8
      ? "text-yellow-500"
      : percentGone < 0.9
      ? "text-yellow-600"
      : "text-red-600";
  return (
    <div className="p-2 text-left">
      <div className="shadow rounded-lg bg-white">
        <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
          <div className="-ml-4 -mt-2 flex items-center justify-between flex-wrap sm:flex-nowrap">
            <div className="ml-4 mt-2">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                JWT #{total - index}{" "}
                {index === 0 && (
                  <span className="inline-flex align-bottom items-center px-3 py-0.5 rounded-full text-sm font-medium bg-indigo-100 text-indigo-700">
                    Currently active
                  </span>
                )}
              </h3>
            </div>
            {total > 1 && (
              <div className="ml-4 mt-2 flex-shrink-0 text-gray-500">
                {total} JWTs generated since page load
              </div>
            )}
            {total == 1 && (
              <div className="ml-4 mt-2 flex-shrink-0 text-gray-500">
                1 JWT generated since page load
              </div>
            )}
          </div>
        </div>
        <div
          className={`h-1 transition-all ease-linear duration-100 ${barColor}`}
          style={{ width: `${percentGone * 100}%` }}
        ></div>
        <div className="px-4 py-5 sm:px-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Issued At</dt>
              <dd className="mt-1 text-2xl text-gray-900">
                {new Date(claims.iat * 1000).toLocaleString()}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-right text-sm font-medium text-gray-500">
                Expires In
              </dt>
              <dd
                className={`text-right mt-1 text-2xl text-gray-900 ${textColor}`}
              >
                {percentGone === 1
                  ? "Expired"
                  : `${Math.round((claims.exp * 1000 - time) / 1000)} seconds`}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
};

const JWTDemo = () => {
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

  if (tokens.list.length === 0) {
    return null;
  }
  return (
    <div className="-mx-2">
      <Carousel
        key={`car` + tokens.list.length}
        selectedItem={tokens.active}
        onChange={(index) => {
          setActuallyActive(index);
        }}
        showIndicators={false}
        showThumbs={false}
        showStatus={false}
      >
        {tokens.list.map((token, index) => (
          <TokenRender
            key={token}
            token={token}
            index={index}
            total={tokens.list.length}
            time={time}
          />
        ))}
      </Carousel>
    </div>
  );
};

const JWTMock = () => {
  const total = 5;
  const index = 0;
  const percentGone = 0;
  return (
    <div className="-mx-2">
      <div className="p-2 text-left">
        <div className="shadow rounded-lg bg-white relative overflow-hidden">
          <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
            <div className="-ml-4 -mt-2 flex items-center justify-between flex-wrap sm:flex-nowrap">
              <div className="ml-4 mt-2">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  JWT #1
                </h3>
              </div>
              <div className="ml-4 mt-2 flex-shrink-0 text-gray-500">
                1 JWT generated since page load
              </div>
            </div>
          </div>
          <div
            className={`h-1 transition-all ease-linear duration-100 bg-green-500`}
            style={{ width: "33%" }}
          ></div>
          <div className="px-4 py-5 sm:px-6">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Issued At</dt>
                <dd className="mt-1 text-2xl text-gray-900">
                  {new Date().toLocaleString()}
                </dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-right text-sm font-medium text-gray-500">
                  Expires In
                </dt>
                <dd className={`text-right mt-1 text-2xl text-green-500`}>
                  40 seconds
                </dd>
              </div>
            </dl>
          </div>
          <SignUpCover>Sign in to see JWT demo</SignUpCover>
        </div>
      </div>
    </div>
  );
};
