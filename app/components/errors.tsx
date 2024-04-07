import type { FC } from 'react';
import { ErrorResponse, Link } from '@remix-run/react';

interface BaseErrorProps {
  reroute?: string;
  rerouteMessage?: string;
}

interface UnhandledErrorProps extends BaseErrorProps {
  error: unknown;
}

interface HandledErrorProps extends BaseErrorProps {
  error: ErrorResponse;
}

export const UnhandledError: FC<UnhandledErrorProps> = ({
  error,
  reroute = '/',
  rerouteMessage = 'Return to the home page',
}) => {
  return (
    <>
      <h1 className='text-2xl pb-3'>Whoops! Something went wrong.</h1>
      <p className='block'>
        You&apos;re seeing this because an unexpected error occured:
      </p>
      {error instanceof Error ? (
        <p className='my-4 font-bold'>{error.message}</p>
      ) : (
        <div>
          <p>
            The error was not an instance of error. Attempting to stringify
            below:
          </p>
          <p>{JSON.stringify(error)}</p>
        </div>
      )}
      <Link to={reroute} className='text-blue-800'>
        {rerouteMessage}
      </Link>
    </>
  );
};

export const HandledError: FC<HandledErrorProps> = ({
  error,
  reroute = '/',
  rerouteMessage = 'Return to the home page',
}) => {
  return (
    <>
      <h1 className='text-2xl pb-3'>
        {error.status} - {error.statusText}
      </h1>
      <p>You&apos;re seeing this because an error occurred:</p>
      <p className='my-4 font-bold'>{error.data.message}</p>
      <Link to={reroute} className='text-blue-800'>
        {rerouteMessage}
      </Link>
    </>
  );
};
