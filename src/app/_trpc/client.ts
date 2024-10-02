// File: _trpc/client.ts

import { createTRPCReact } from '@trpc/react-query';
import { AppRouter } from '../trpc'; // Ensure this path is correct

export const trpc = createTRPCReact<AppRouter>();
