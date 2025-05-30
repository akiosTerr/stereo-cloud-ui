import Cookies from "js-cookie";

export type VideoAsset = {
    id: string,
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

export const getMuxVideos = async (): Promise<VideoAsset[]> => {
    let token = Cookies.get('jwtToken');
    
    if (!token) {
        token = "";
    }

    const response = await fetch('http://localhost:3000/mux/assets',
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

export const fetchVideoToken = async (playback_id?: string) => {
   
    if(!playback_id) {
        return new Error("no playback id found!")
    }

     let token = Cookies.get('jwtToken');
     console.log(playback_id);
     
    
    if (!token) {
        token = "";
    }

    const response = await fetch(`http://localhost:3000/mux/sign/${playback_id}`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

    const data = await response.json();
    return data;
}

export const fetchVideoInfo = async (id?: string) => {
     
    if(!id) {
        return new Error("no playback id found!")
    }

     let token = Cookies.get('jwtToken');     
    
    if (!token) {
        token = "";
    }

    const response = await fetch(`http://localhost:3000/mux/${id}`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

    const data = await response.json();
    return data;
}