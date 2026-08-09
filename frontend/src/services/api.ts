import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

export const getTrendingSongs = async () => {
  const response = await axios.get(`${API_BASE_URL}/songs/trending`);
  return response.data;
};

export const searchSongs = async (query: string) => {
  const response = await axios.get(`${API_BASE_URL}/songs/search`, {
    params: { q: query },
  });
  return response.data;
};

export const uploadSong = async (formData: FormData) => {
  const response = await axios.post(`${API_BASE_URL}/songs/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};
