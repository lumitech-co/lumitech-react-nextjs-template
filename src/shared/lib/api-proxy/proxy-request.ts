import { NextRequest, NextResponse } from 'next/server';

import { env } from 'env';

import { buildForwardHeaders } from './build-forward-headers';
import { buildResponseHeaders } from './build-response-headers';

const METHODS_WITH_BODY = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

const hasRequestBody = (method: string): boolean =>
  METHODS_WITH_BODY.has(method.toUpperCase());

const buildUpstreamUrl = (
  request: NextRequest,
  pathSegments: string[] | undefined,
): URL => {
  const upstreamPath = `/api/${pathSegments?.join('/') ?? ''}`;
  const upstreamUrl = new URL(upstreamPath, env.API_UPSTREAM_URL);

  upstreamUrl.search = request.nextUrl.search;

  return upstreamUrl;
};

export const proxyRequest = async (
  request: NextRequest,
  pathSegments: string[] | undefined,
): Promise<NextResponse> => {
  const upstreamUrl = buildUpstreamUrl(request, pathSegments);
  const method = request.method.toUpperCase();

  const upstreamInit: RequestInit & { duplex?: 'half' } = {
    method,
    headers: buildForwardHeaders(request),
    body: hasRequestBody(method) ? request.body : undefined,
  };

  if (hasRequestBody(method)) {
    // Required when streaming a request body in Node 18+ fetch.
    upstreamInit.duplex = 'half';
  }

  const upstreamResponse = await fetch(upstreamUrl, upstreamInit);
  const isSecureContext = request.nextUrl.protocol === 'https:';

  return new NextResponse(upstreamResponse.body, {
    status: upstreamResponse.status,
    statusText: upstreamResponse.statusText,
    headers: buildResponseHeaders(upstreamResponse.headers, isSecureContext),
  });
};
