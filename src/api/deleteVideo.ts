
import Cookies from "js-cookie";

export const deleteMuxVideo = async (id: string, asset_id: string) => {
  let token = Cookies.get('jwtToken');
  if (!token) {
    token = ""
  }
  const response = await fetch(`http://localhost:3000/mux/${id}/${asset_id}`,
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