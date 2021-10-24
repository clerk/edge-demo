import React from "react";
import { SignedIn, SignedOut, useSession, useUser } from "@clerk/clerk-react";
import { LeftPattern } from "../utils/patterns";
import { getVercelRegion } from "../utils/vercelRegion";
import { SignInCover } from "../utils/buttons";

export default function TryRevocation() {
  return (
    <div className="bg-gray-50 overflow-hidden">
      <div className="relative max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <LeftPattern />

        <div className="relative lg:grid lg:grid-cols-3 lg:gap-x-8">
          <div className="lg:col-span-1 mb-8">
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Try revocation
            </h2>
            <p className="mt-3 mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl">
              Sign in on two devices to test revocation
            </p>
          </div>
          <div className="lg:col-span-2">
            <div className="relative lg:grid lg:grid-cols-2 lg:gap-x-8">
              <SignedIn>
                <SessionList />
              </SignedIn>
              <SignedOut>
                <SessionMock />
              </SignedOut>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SessionList() {
  const user = useUser();
  const session = useSession();

  // userSessions is a list of all sessions for the user
  const [userSessions, setUserSessions] = React.useState(null);

  React.useEffect(() => {
    user.getSessions().then((userSessions) => {
      userSessions.sort((x, y) => y.expireAt.getTime() - x.expireAt.getTime());
      userSessions.reverse();
      setUserSessions(userSessions);
    });
  }, [user]);

  if (!userSessions) {
    return null;
  }

  return (
    <>
      {userSessions.map((userSession, index) => (
        <SessionItem
          key={userSession.id}
          userSession={userSession}
          index={index}
        />
      ))}
      {userSessions.length === 1 && <SessionMock2 />}
    </>
  );
}

const SessionItem = ({ userSession, index }) => {
  // deviceSession is the particular session on this device
  const deviceSession = useSession();
  const thisDevice = deviceSession.id === userSession.id;
  const activity = userSession.latestActivity;
  return (
    <div className="bg-white shadow rounded-lg mb-4">
      <div className="border-b py-3 px-4 flex items-center justify-between flex-wrap sm:flex-nowrap">
        <div>
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Device #{index + 1}{" "}
            {thisDevice && (
              <span className="inline-flex align-bottom items-center px-3 py-0.5 rounded-full text-sm font-medium bg-indigo-100 text-indigo-700">
                This device
              </span>
            )}
          </h3>
        </div>
        <div className="flex-shrink-0">
          {!thisDevice ? (
            <button
              type="button"
              className={`relative inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
              onClick={() => {
                userSession.revoke();
              }}
            >
              Revoke
            </button>
          ) : (
            <div style={{ height: "34px" }}></div>
          )}
        </div>
      </div>

      <div className="px-4 py-3">
        <div>
          <dl className="grid grid-cols-1 gap-x-4 gap-y-6 grid-cols-2">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">IP Address</dt>
              <dd className="mt-1 text-gray-900 overflow-ellipsis">
                {activity.ipAddress}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Device type</dt>
              <dd className="mt-1 text-gray-900">
                {activity.isMobile ? "Mobile" : "Desktop"}
              </dd>
            </div>

            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Browser</dt>
              <dd className="mt-1 text-gray-900">{activity.browserName}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">
                Operating system
              </dt>
              <dd className="mt-1 text-gray-900">{activity.deviceType}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
};

const SessionMock = () => {
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden relative">
      <div className="border-b py-3 px-4 flex items-center justify-between flex-wrap sm:flex-nowrap">
        <div>
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Device #1{" "}
            <span className="inline-flex align-bottom items-center px-3 py-0.5 rounded-full text-sm font-medium bg-indigo-100 text-indigo-700">
              This device
            </span>
          </h3>
        </div>
        <div className="flex-shrink-0">
          <div style={{ height: "34px" }}></div>
        </div>
      </div>

      <div className="px-4 py-3 relative">
        <dl className="grid grid-cols-1 gap-x-4 gap-y-6 grid-cols-2">
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">IP Address</dt>
            <dd className="mt-1 text-gray-900 overflow-ellipsis">--</dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Device type</dt>
            <dd className="mt-1 text-gray-900">--</dd>
          </div>

          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Browser</dt>
            <dd className="mt-1 text-gray-900">--</dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">
              Operating system
            </dt>
            <dd className="mt-1 text-gray-900">--</dd>
          </div>
        </dl>
        <SignInCover>Sign in to see device details</SignInCover>
      </div>
    </div>
  );
};

const SessionMock2 = () => {
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden relative mb-4">
      <div className="border-b py-3 px-4 flex items-center justify-between flex-wrap sm:flex-nowrap">
        <div>
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Device #2
          </h3>
        </div>
        <div className="flex-shrink-0">
          <div style={{ height: "34px" }}></div>
        </div>
      </div>

      <div className="px-4 py-3 relative">
        <dl className="grid grid-cols-1 gap-x-4 gap-y-6 grid-cols-2">
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">IP Address</dt>
            <dd className="mt-1 text-gray-900 overflow-ellipsis">--</dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Device type</dt>
            <dd className="mt-1 text-gray-900">--</dd>
          </div>

          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Browser</dt>
            <dd className="mt-1 text-gray-900">--</dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">
              Operating system
            </dt>
            <dd className="mt-1 text-gray-900">--</dd>
          </div>
        </dl>
        <div className="absolute top-0 left-0 right-0 bottom-0 backdrop-filter backdrop-blur bg-gray-900 bg-opacity-50 flex flex-col justify-center items-center">
          <p className="text-base font-semibold mb-3 text-center">
            Sign in to{" "}
            {window.location.origin.substring(
              window.location.protocol.length + 2
            )}{" "}
            on
            <br />
            another device and refresh
          </p>
          <button
            type="button"
            onClick={() => {
              window.location.reload();
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Refresh
          </button>
        </div>
      </div>
    </div>
  );
};
