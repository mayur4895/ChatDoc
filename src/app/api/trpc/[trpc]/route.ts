// route.ts
import { appRouter } from '../../../trpc'; // Adjust this path as needed for your project structure
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { NextRequest } from 'next/server';

const handler = (req: NextRequest) => {
  return fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: () => ({}),  
  });
};

export const GET = handler;
export const POST = handler;
