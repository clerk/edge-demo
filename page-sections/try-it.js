import React from "react";
import { ClerkLoaded } from "@clerk/clerk-react";
import { getVercelRegion } from "../utils/vercelRegion";

import {
  GlobeAltIcon,
  LightningBoltIcon,
  MailIcon,
  ScaleIcon,
} from "@heroicons/react/outline";

export default function Example() {
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
              Try it
            </h2>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Compare the latency at edge versus a single origin in San
              Francisco, CA.
            </p>
          </div>
          <div className="lg:col-span-1">
            <Requester
              path="/api/helloEdge"
              label="Edge request"
              labelColor="text-indigo-600"
              button="Make edge request"
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
              label="Origin request"
              labelColor="text-gray-500"
              button="Make origin request"
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
    <ClerkLoaded>
      <h2
        className={`${labelColor} text-base font-semibold tracking-wider uppercase`}
      >
        {label}
      </h2>
      <div className="mt-4 bg-white shadow sm:rounded-lg">
        <button
          onClick={makeRequest}
          type="button"
          className={`block w-full items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg rounded-b-none ${buttonShadow} ${buttonColor} ${buttonBgColor} hover:${buttonBgColorHover} focus:outline-none focus:ring-2 focus:${buttonBgColorFocus}`}
        >
          {button}
        </button>
        <div className="px-4 py-5 sm:px-6">
          <Result result={result} />
        </div>
      </div>
    </ClerkLoaded>
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
          Authentication time
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
        <dt className="text-sm font-medium text-gray-500">
          Authentication result
        </dt>
        {result ? (
          <dd className="mt-1 text-gray-900">
            {result.userId ? "Signed in" : "Signed out"}
          </dd>
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
