import axios from 'axios';

function getApiBaseUrl(): string {
  const rawEnv = process.env.NEXT_PUBLIC_API_PROXY;

  if (!rawEnv) {
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
