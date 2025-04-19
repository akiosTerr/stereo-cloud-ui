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


export const createMuxUpload = async (): Promise<MuxUploadResponse> => {
  let token = Cookies.get('jwtToken');
  if (!token) {
    token = ""
  }
  const response = await fetch('http://localhost:3000/mux/upload',
    {
      method: 'POST',
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