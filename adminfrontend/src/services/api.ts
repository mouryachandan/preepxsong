import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

export const uploadSong = async (formData: FormData) => {
  const response = await axios.post(`${API_BASE_URL}/songs/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const getSongs = async () => {
  const response = await axios.get(`${API_BASE_URL}/songs/trending`);
  return response.data;
};

export const deleteSong = async (id: string) => {
  const response = await axios.delete(`${API_BASE_URL}/songs/${id}`);
  return response.data;
};
