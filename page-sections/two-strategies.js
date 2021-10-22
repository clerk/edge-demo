import React from "react";
import {
  SignedIn,
  SignedOut,
  ClerkLoading,
  useClerk,
} from "@clerk/clerk-react";
import { getVercelRegion } from "../utils/vercelRegion";

import {
  GlobeAltIcon,
  LightningBoltIcon,
  MailIcon,
  ScaleIcon,
} from "@heroicons/react/outline";

export default function TwoStrategies() {
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
              Two strategies
            </h2>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Clerk supports both stateless and stateful authentication
              strategies at the edge
            </p>
          </div>
          <div className="lg:col-span-1">
            <Requester
              path="/api/helloEdge"
              description={
                <>
                  Before the request, Clerk generates a short-lived JWT (JSON
                  Web Token) to authenticate the user, usually in under 1
                  millisecond.
                </>
              }
              label="Stateless"
              badge={
                <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                  Recommended
                </span>
              }
              labelColor="text-indigo-600"
              button="Try stateless auth"
              buttonColor="text-white"
              buttonShadow="shadow-lg"
              buttonBgColor="bg-indigo-600"
              buttonBgColorHover="bg-indigo-700"
              buttonBgColorFocus="ring-indigo-500"
            />
          </div>
          <div className="lg:col-span-1">
            <Requester
              path="/api/hello"
              label="Stateful"
              description={
                <>
                  When a request is received, Clerk authenticates the user with
                  an API request to our servers. This is much slower, but
                  enables immediate session revocation.
                </>
              }
              labelColor="text-gray-900"
              button="Try stateful auth"
              buttonColor="text-indigo-700"
              buttonShadow="shadow-sm"
              buttonBgColor="bg-indigo-100"
              buttonBgColorHover="bg-indigo-200"
              buttonBgColorFocus="ring-indigo-200"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

const Requester = ({
  path,
  label,
  badge,
  description,
  labelColor,
  button,
  buttonColor,
  buttonBgColor,
  buttonBgColorFocus,
  buttonBgColorHover,
  buttonShadow,
}) => {
  const [result, setResult] = React.useState(null);
  const makeRequest = async () => {
    const start = new Date().getTime();
    const response = await fetch(path, {
      method: "GET",
    });
    if (response.status === 200) {
      const responseTime = new Date().getTime() - start;
      const data = await response.json();
      setResult({
        responseTime: responseTime,
        responseRegion: getVercelRegion(response.headers.get("x-vercel-id")),
        ...data,
      });
    }
  };

  return (
    <>
      <div className="flex items-center">
        <h2 className={`${labelColor} text-2xl font-semibold mr-2`}>{label}</h2>
        {badge}
      </div>
      <p className="mt-1 text-gray-500">{description}</p>

      <div className="mt-4 bg-white shadow sm:rounded-lg">
        <div className="border-b py-3 px-4 flex items-center justify-between flex-wrap sm:flex-nowrap">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              {label} demo
            </h3>
          </div>
          <div className="flex-shrink-0">
            <SignedIn>
              <button
                onClick={makeRequest}
                type="button"
                className={`relative inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow ${buttonColor} ${buttonBgColor} hover:${buttonBgColorHover} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:${buttonBgColorFocus}`}
              >
                Try it
              </button>
            </SignedIn>
            <SignedOut>
              <SignUpButton
                type="button"
                className={`relative inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow ${buttonColor} ${buttonBgColor} hover:${buttonBgColorHover} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:${buttonBgColorFocus}`}
              >
                Sign in to try it
              </SignUpButton>
            </SignedOut>
            <ClerkLoading>
              {/* This is a shim to prevent layout shift */}
              <div style={{ height: "34px" }}></div>
            </ClerkLoading>
          </div>
        </div>

        <div className="px-4 py-3">
          <Result result={result} />
        </div>
      </div>
    </>
  );
};

const SignUpButton = ({ children, ...props }) => {
  const { openSignUp } = useClerk();
  return (
    <button {...props} onClick={() => openSignUp()}>
      {children}
    </button>
  );
};

const Result = ({ result }) => {
  return (
    <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
      <div className="sm:col-span-1">
        <dt className="text-sm font-medium text-gray-500">Response time</dt>
        {result ? (
          <dd className="mt-1 text-2xl text-gray-900">
            {result.responseTime} ms
          </dd>
        ) : (
          <dd className="mt-1 text-2xl text-gray-900">-- ms</dd>
        )}
      </div>
      <div className="sm:col-span-1">
        <dt className="text-sm font-medium text-gray-500">
          Authentication speed
        </dt>
        {result ? (
          <dd className="mt-1 text-2xl text-gray-900">
            {result.authenticationTime || "< 1"} ms
          </dd>
        ) : (
          <dd className="mt-1 text-2xl text-gray-900">-- ms</dd>
        )}
      </div>

      <div className="sm:col-span-1">
        <dt className="text-sm font-medium text-gray-500">Response region</dt>
        {result ? (
          <dd className="mt-1 text-gray-900">{result.responseRegion}</dd>
        ) : (
          <dd className="mt-1 text-gray-900">--</dd>
        )}
      </div>
      <div className="sm:col-span-1">
        <dt className="text-sm font-medium text-gray-500">User ID</dt>
        {result ? (
          <dd className="mt-1 text-gray-900">{result.userId}</dd>
        ) : (
          <dd className="mt-1 text-gray-900">--</dd>
        )}
      </div>
      <div className="sm:col-span-2 hidden">
        <dt className="text-sm font-medium text-gray-500">User ID</dt>
        <dd className="mt-1 text-sm text-gray-900">null</dd>
      </div>
    </dl>
  );
};
