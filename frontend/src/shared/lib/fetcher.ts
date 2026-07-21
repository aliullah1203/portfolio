import axios from 'axios';

const client = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function fetcher<T>(url: string) {
  const response = await client.get<T>(url);
  return response.data;
}
