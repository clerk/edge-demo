import React from "react";
import {
  SignedIn,
  SignedOut,
  ClerkLoading,
  useClerk,
} from "@clerk/clerk-react";
import { LeftPattern } from "../utils/patterns";
import { SignUpCover } from "../utils/buttons";
import { getVercelRegion } from "../utils/vercelRegion";

import {
  GlobeAltIcon,
  LightningBoltIcon,
  MailIcon,
  ScaleIcon,
} from "@heroicons/react/outline";

export default function TwoStrategies() {
  // On mobile, stateful will start as hidden
  const [visible, setVisible] = React.useState("stateless");
  return (
    <div className="bg-gray-50 overflow-hidden">
      <div className="relative max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <LeftPattern />

        <div className="relative lg:grid lg:grid-cols-3 lg:gap-x-8">
          <div className="lg:col-span-1 mb-4 sm:mb-8">
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Two strategies
            </h2>
            <p className="mt-3 mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl">
              Clerk supports both stateless and stateful authentication at the
              edge
            </p>
          </div>
          <div className="border-b border-gray-200 mb-6 sm:hidden">
            <nav className="w-full flex bg-gray-50 z-50">
              <button
                className={`${
                  visible === "stateless"
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } flex-1 w-1/4 py-4 px-1 text-center border-b-2 font-medium text-base`}
                onClick={() => setVisible("stateless")}
              >
                Stateless
              </button>
              <button
                className={`${
                  visible === "stateful"
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } flex-1 w-1/4 py-4 px-1 text-center border-b-2 font-medium text-base`}
                onClick={() => setVisible("stateful")}
              >
                Stateful
              </button>
            </nav>
          </div>

          <div className="lg:col-span-2">
            <div className="sm:grid sm:grid-cols-2 sm:gap-x-6 md-gap-x-8">
              <Requester
                hidden={visible !== "stateless"}
                order={[1, 3]}
                path="/api/stateless"
                description={
                  <>
                    Before a request, Clerk generates a short-lived JWT (JSON
                    Web Token) for authentication. Verifying the JWT takes less
                    than 1 ms!
                  </>
                }
                label="Stateless"
                badge={
                  <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-indigo-100 text-indigo-700">
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
              <Requester
                hidden={visible !== "stateful"}
                order={[2, 4]}
                path="/api/stateful"
                label="Stateful"
                description={
                  <>
                    Clerk's API is used to authenticate the user. This adds
                    network latency, but enables sessions to be revoked
                    immediately.
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
    </div>
  );
}

const Requester = ({
  hidden,
  order,
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
      <div className={`${hidden ? "hidden" : ""} sm:block order-${order[0]}`}>
        <div className="flex items-center">
          <h2 className={`${labelColor} text-2xl font-semibold mr-2`}>
            {label}
          </h2>
          {badge}
        </div>
        <p className="mt-1 text-gray-500">{description}</p>
      </div>
      <div
        className={`${hidden ? "hidden" : ""} sm:block order-${
          order[1]
        } mt-4 bg-white shadow rounded-lg overflow-hidden`}
      >
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
              <div style={{ height: "34px" }}></div>
            </SignedOut>
            <ClerkLoading>
              {/* This is a shim to prevent layout shift */}
              <div style={{ height: "34px" }}></div>
            </ClerkLoading>
          </div>
        </div>

        <div className="px-4 py-3 relative">
          <Result result={result} />
          <SignedOut>
            <SignUpCover>
              Sign in to test {label.toLowerCase()} latency
            </SignUpCover>
          </SignedOut>
        </div>
      </div>
    </>
  );
};

const Result = ({ result }) => {
  return (
    <dl className="grid gap-x-4 gap-y-6 sm:gap-y-4 md:gap-y-6 grid-cols-2">
      <div className="col-span-1 sm:col-span-2 md:col-span-1">
        <dt className="text-sm font-medium text-gray-500">Response time</dt>
        {result ? (
          <dd className="mt-1 text-2xl text-gray-900">
            {result.responseTime} ms
          </dd>
        ) : (
          <dd className="mt-1 text-2xl text-gray-900">-- ms</dd>
        )}
      </div>
      <div className="col-span-1 sm:col-span-2 md:col-span-1">
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

      <div className="col-span-1 sm:col-span-2 md:col-span-1">
        <dt className="text-sm font-medium text-gray-500">Response region</dt>
        {result ? (
          <dd className="mt-1 text-gray-900">{result.responseRegion}</dd>
        ) : (
          <dd className="mt-1 text-gray-900">--</dd>
        )}
      </div>

      <div className="col-span-1 sm:col-span-2 md:col-span-1">
        <dt className="text-sm font-medium text-gray-500">User ID</dt>
        {result ? (
          <dd className="mt-1 text-gray-900 overflow-hidden overflow-ellipsis">
            {result.userId}
          </dd>
        ) : (
          <dd className="mt-1 text-gray-900">--</dd>
        )}
      </div>
    </dl>
  );
};
