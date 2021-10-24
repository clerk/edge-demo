import React from 'react';

export const TokenRenderer = ({ token, index, time, total }) => {
  const claims = JSON.parse(atob(token.split('.')[1]));
  const percentGone = Math.min(
    1,
    (time - claims.iat * 1000) / (claims.exp * 1000 - claims.iat * 1000),
  );
  const barColor =
    percentGone < 0.5
      ? 'bg-green-500'
      : percentGone < 0.6
      ? 'bg-yellow-300'
      : percentGone < 0.7
      ? 'bg-yellow-400'
      : percentGone < 0.8
      ? 'bg-yellow-500'
      : percentGone < 0.9
      ? 'bg-yellow-600'
      : 'bg-red-600';
  const textColor =
    percentGone < 0.5
      ? 'text-green-500'
      : percentGone < 0.6
      ? 'text-yellow-300'
      : percentGone < 0.7
      ? 'text-yellow-400'
      : percentGone < 0.8
      ? 'text-yellow-500'
      : percentGone < 0.9
      ? 'text-yellow-600'
      : 'text-red-600';
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
          style={{ width: `${percentGone * 100}%` }}
        />
        <div className='px-7 py-5'>
          <dl className='flex justify-between'>
            <div>
              <dt className='text-sm font-medium text-gray-500'>Issued At</dt>
              <dd className='mt-1 text-base sm:text-2xl text-gray-900'>
                {new Date(claims.iat * 1000).toLocaleString()}
              </dd>
            </div>
            <div>
              <dt className='text-right text-sm font-medium text-gray-500'>
                Expires In
              </dt>
              <dd
                className={`text-right mt-1 text-base sm:text-2xl text-gray-900 ${textColor}`}
              >
                {percentGone === 1
                  ? 'Expired'
                  : `${Math.round((claims.exp * 1000 - time) / 1000)} seconds`}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
};
