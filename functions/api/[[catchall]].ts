import { handleApiRequest } from '../../server/worker';

export const onRequest = async (context: { request: Request; env: any; waitUntil: (promise: Promise<any>) => void }) => {
  return handleApiRequest(context.request, context.env, context);
};
