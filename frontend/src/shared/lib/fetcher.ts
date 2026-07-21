import axios from 'axios';

const client = axios.create({
  baseURL: 'https://portfolio-6i9r.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function fetcher<T>(url: string) {
  const response = await client.get<T>(url);
  return response.data;
}
