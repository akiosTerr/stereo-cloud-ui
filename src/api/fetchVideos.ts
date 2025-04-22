import Cookies from "js-cookie";

export type VideoAsset = {
    user_id: string,
    upload_id: string,
    asset_id: string,
    playback_id: string,
    title: string,
    status: string,
    created_at: string,
    updated_at: string
  }

export const getMuxAssets = async (): Promise<VideoAsset[]> => {
    let token = Cookies.get('jwtToken');
    
    if (!token) {
        token = "";
    }

    const response = await fetch('http://localhost:3000/mux/',
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

    const data = await response.json();
    return data;
};