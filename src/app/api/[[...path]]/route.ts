import { NextRequest } from 'next/server';

import { proxyRequest } from '../../../shared/lib/api-proxy';

type RouteContext = {
  params: { path?: string[] };
};

const handleProxy = (
  request: NextRequest,
  context: RouteContext,
): Promise<Response> => proxyRequest(request, context.params.path);

export const GET = handleProxy;
export const POST = handleProxy;
export const PUT = handleProxy;
export const PATCH = handleProxy;
export const DELETE = handleProxy;

export const OPTIONS = (): Response => new Response(null, { status: 204 });
