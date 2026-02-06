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

export type LivestreamStatus = 'idle' | 'active' | 'completed';

export type VideoInfo = {
    id: string;
    [key: string]: unknown;
    isLivestream?: boolean;
    livestreamStatus?: LivestreamStatus;
};

export type LivestreamStatusResponse = {
    isLivestream: boolean;
    livestreamStatus?: LivestreamStatus;
};

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

export const fetchPlayerInfo = async (id?: string) => {
    if(!id) {
        return new Error("no playback id found!")
    }

     let token = Cookies.get('jwtToken');     
    
    if (!token) {
        token = "";
    }

    const response = await fetch(`${apiUrl}/mux/player/${id}`,
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

export const fetchLivestreamStatus = async (videoId: string): Promise<LivestreamStatusResponse> => {
    const token = Cookies.get('jwtToken') ?? '';

    const response = await fetch(`${apiUrl}/mux/video/${videoId}/livestream-status`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });

    if (response.status === 401) {
        throw new Error('Unauthorized');
    }

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Failed to fetch livestream status: ${error}`);
    }

    return response.json();
};

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

export type LiveStreamAsset = {
    id: string;
    user_id: string;
    live_stream_id: string;
    title?: string;
    isPrivate: boolean;
    stream_key: string;
    status: string;
    playback_id: string;
    created_at: string;
    updated_at: string;
};

export type ActiveLiveStream = LiveStreamAsset & {
    user?: { channel_name: string };
};

export const getActiveLiveStreams = async (): Promise<ActiveLiveStream[]> => {
    const token = Cookies.get('jwtToken') ?? '';

    const response = await fetch(`${apiUrl}/mux/live-streams/active`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });

    if (response.status === 401) {
        throw new Error('Unauthorized');
    }

    const data = await response.json();
    return data;
};

export const getLiveStreams = async (): Promise<LiveStreamAsset[]> => {
    let token = Cookies.get('jwtToken');

    if (!token) {
        token = "";
    }

    const response = await fetch(`${apiUrl}/mux/live-streams`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });

    if (response.status === 401) {
        throw new Error('Unauthorized');
    }

    const data = await response.json();
    return data;
};

export const createLiveStream = async (body: { title?: string; isPrivate?: boolean }): Promise<LiveStreamAsset> => {
    const token = Cookies.get('jwtToken') ?? '';

    const response = await fetch(`${apiUrl}/mux/live-stream`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(body),
    });

    if (response.status === 401) {
        throw new Error('Unauthorized');
    }
    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message ?? 'Failed to create live stream');
    }

    return response.json();
};

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