import axios from 'axios';
import { env } from 'env';

const TIMEOUT_MS = 10_000;

export const api = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL,
  timeout: TIMEOUT_MS,
  headers: {
    'Content-Type': 'application/json',
  },
});
