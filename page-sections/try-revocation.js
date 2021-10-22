import React from "react";
import {
  SignedIn,
  SignedOut,
  ClerkLoading,
  useClerk,
  useSession,
  useUser,
} from "@clerk/clerk-react";
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
              Try revocation
            </h2>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Sign in on two devices to test revocation
            </p>
          </div>
          <div className="lg:col-span-2">
            <SignedIn>
              <SessionList />
            </SignedIn>
          </div>
        </div>
      </div>
    </div>
  );
}

// import {
//   ActivityListItem,
//   ActivityListItemSkeleton,
// } from 'ui/userProfile/Security/DevicesAndActivity/ActivityListItem';

const SessionItem = ({ userSession, index }) => {
  // deviceSession is the particular session on this device
  const deviceSession = useSession();
  const thisDevice = deviceSession.id === userSession.id;
  const activity = userSession.latestActivity;
  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="border-b py-3 px-4 flex items-center justify-between flex-wrap sm:flex-nowrap">
        <div>
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Session #{index + 1}{" "}
            {thisDevice && (
              <span className="inline-flex align-bottom items-center px-3 py-0.5 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
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
          <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
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
              <dd className="mt-1 text-sm text-gray-900">
                {activity.deviceType}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
};

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
    <div className="relative lg:grid lg:grid-cols-2 lg:gap-x-8">
      {userSessions.map((userSession, index) => (
        <SessionItem
          key={userSession.id}
          userSession={userSession}
          index={index}
        />
      ))}
    </div>
  );
}
