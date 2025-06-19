import Cookies from "js-cookie";

export type MuxUploadResponse = {
  data: {
    url: string;
    timeout: number;
    status: 'waiting' | 'asset_created' | 'errored';
    new_asset_settings: {
      playback_policies: Array<'public' | 'signed'>;
      video_quality: 'basic' | 'standard' | 'high';
    };
    id: string;
    cors_origin: string;
  };
};

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const createMuxUpload = async (videoTitle: string, isPrivate: boolean): Promise<MuxUploadResponse> => {
  let token = Cookies.get('jwtToken');
  if (!token) {
    token = ""
  }
  const response = await fetch(`${apiUrl}/mux/upload`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        title: videoTitle,
        isPrivate
      })
    });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`MUX Upload Failed: ${error}`);
  }

  const data = await response.json();
  return data;
};