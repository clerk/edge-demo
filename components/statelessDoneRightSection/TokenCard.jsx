import React from 'react';
import { useForceRender } from 'utils/forceRender';

const getColorForPercentage = p => {
  return p < 50
    ? 'green-500'
    : p < 60
    ? 'yellow-300'
    : p < 70
    ? 'yellow-400'
    : p < 80
    ? 'yellow-500'
    : p < 90
    ? 'yellow-600'
    : 'red-600';
};

const parseToken = token => {
  return JSON.parse(atob(token.split('.')[1]));
};

const parseClaims = claims => {
  const now = Math.round(Date.now() / 1000);
  const issuedAt = claims.iat;
  const expiresAt = claims.exp;
  const totalValidForSec = expiresAt - issuedAt;
  const timeToLiveInSec = Math.max(expiresAt - now, 0);
  return { issuedAt, expiresAt, totalValidForSec, timeToLiveInSec, now };
};

export const TokenCard = ({ token, index, total }) => {
  useForceRender();
  const { totalValidForSec, timeToLiveInSec, issuedAt } = parseClaims(
    parseToken(token),
  );
  const percentGone =
    100 - Math.round((100 * timeToLiveInSec) / totalValidForSec);

  const barColor = 'bg-' + getColorForPercentage(percentGone);
  const textColor = 'text-' + getColorForPercentage(percentGone);

  return (
    <div className='p-2 text-left'>
      <div className='shadow rounded-lg bg-white'>
        <div className='px-7 py-5 border-b border-gray-200'>
          <h3 className='text-lg leading-6 font-medium text-gray-900'>
            JWT #{total - index}{' '}
            {index === 0 && (
              <span className='inline-flex align-bottom items-center px-3 py-0.5 rounded-full text-sm font-medium bg-indigo-100 text-indigo-700'>
                Currently active
              </span>
            )}
          </h3>
        </div>
        <div
          className={`h-1 transition-all ease-linear duration-100 ${barColor}`}
          style={{ width: `${percentGone}%` }}
        />
        <div className='px-7 py-5'>
          <dl className='flex justify-between'>
            <div>
              <dt className='text-sm font-medium text-gray-500'>Issued At</dt>
              <dd className='mt-1 text-base sm:text-2xl text-gray-900'>
                {new Date(issuedAt * 1000).toLocaleString()}
              </dd>
            </div>
            <div>
              <dt className='text-right text-sm font-medium text-gray-500'>
                Expires In
              </dt>
              <dd
                className={`text-right mt-1 text-base sm:text-2xl text-gray-900 ${textColor}`}
              >
                {percentGone === 100 ? 'Expired' : `${timeToLiveInSec} seconds`}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
};
