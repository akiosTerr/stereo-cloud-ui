import Cookies from "js-cookie";

export type FormatedVideoAsset = {
    id: string,
    user_id: string,
    upload_id: string,
    asset_id: string,
    isPrivate: boolean,
    playback_id: string,
    title: string,
    description: string,
    channel_name?: string,
    status: string,
    created_at: string,
    updated_at: string,
    duration?: number
  }

export type VideoAsset = {
    id: string,
    user_id: string,
    upload_id: string,
    asset_id: string,
    isPrivate: boolean,
    playback_ids: { id: string, policy: string }[],
    meta: {
        title: string,
    },
    description: string,
    status: string,
    created_at: string,
    updated_at: string
  }

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const getMuxAssets = async (): Promise<FormatedVideoAsset[]> => {
    let token = Cookies.get('jwtToken');
    
    if (!token) {
        token = "";
    }

    const response = await fetch(`${apiUrl}/mux/`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

    if (response.status === 401) {
        throw new Error('Unauthorized');
    }

    const data = await response.json();
    return data;
};

export const getMuxPrivateAssets = async (): Promise<FormatedVideoAsset[]> => {
    let token = Cookies.get('jwtToken');
    
    if (!token) {
        token = "";
    }

    const response = await fetch(`${apiUrl}/mux/private`,
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

export const getMuxVideos = async (page: number = 1, limit: number = 10): Promise<FormatedVideoAsset[]> => {
    let token = Cookies.get('jwtToken');
    
    if (!token) {
        token = "";
    }

    const response = await fetch(`${apiUrl}/mux/home?page=${page}&limit=${limit}`,
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
    
    if (!token) {
        token = "";
    }

    const response = await fetch(`${apiUrl}/mux/sign/${playback_id}`,
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

    const response = await fetch(`${apiUrl}/mux/${id}`,
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

export const fetchVideosByChannelName = async (channel_name?: string): Promise<FormatedVideoAsset[]> => {
    if(!channel_name) {
        return [];
    }
    let token = Cookies.get('jwtToken');
    if (!token) {
        token = "";
    }
    const response = await fetch(`${apiUrl}/mux/profile/${channel_name}`,
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

export const getMuxSharedAssets = async (): Promise<FormatedVideoAsset[]> => {
    let token = Cookies.get('jwtToken');
    
    if (!token) {
        token = "";
    }

    const response = await fetch(`${apiUrl}/mux/shared`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

    if (response.status === 401) {
        throw new Error('Unauthorized');
    }

    const data = await response.json();
    return data;
};