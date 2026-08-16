import axios from 'axios';

function getApiBaseUrl(): string {
  const rawEnv = process.env.NEXT_PUBLIC_API_URL;

  // In development prefer the explicit env or localhost default.
  if (process.env.NODE_ENV === 'development') {
    const envUrl = rawEnv || 'http://localhost:8080';
    return envUrl.replace(/\/$/, '');
  }

  // In production, never use a localhost or plain http URL (prevents mixed-content).
  if (!rawEnv || rawEnv.includes('localhost') || rawEnv.startsWith('http://')) {
    return 'https://portfolio-6i9r.onrender.com';
  }

  return rawEnv.replace(/\/$/, '');
}

const client = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function fetcher<T>(url: string) {
  const response = await client.get<T>(url);
  return response.data;
}

export { getApiBaseUrl };
