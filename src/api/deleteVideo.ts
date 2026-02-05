import Cookies from "js-cookie";

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const deleteMuxVideo = async (id: string, asset_id: string) => {
  let token = Cookies.get('jwtToken');
  if (!token) {
    token = ""
  }
  const response = await fetch(`${apiUrl}/mux/${id}/${asset_id}`,
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`MUX Upload Failed: ${error}`);
  }

  const data = await response.json();
  return data;
};

export const deleteLiveStream = async (id: string) => {
  const token = Cookies.get('jwtToken') ?? '';
  const response = await fetch(`${apiUrl}/mux/live-streams/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Delete live stream failed: ${error}`);
  }
  return response.json();
};