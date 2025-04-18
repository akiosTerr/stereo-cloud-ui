const MUX_TOKEN_ID = import.meta.env.VITE_MUX_TOKEN_ID;
const MUX_TOKEN_SECRET = import.meta.env.VITE_MUX_TOKEN_SECRET;

export type MuxUploadResponse = {
    data: {
      url: string;
      timeout: number;
      status: 'waiting' | 'asset_created' | 'errored'; // inferred possible states
      new_asset_settings: {
        playback_policies: Array<'public' | 'signed'>; // only "public" shown, added "signed" as another valid policy
        video_quality: 'basic' | 'standard' | 'high';  // inferred possible quality levels
      };
      id: string;
      cors_origin: string;
    };
  };


export const createMuxUpload = async (): Promise<MuxUploadResponse> => {
  const response = await fetch('https://api.mux.com/video/v1/uploads', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' +  btoa(`${MUX_TOKEN_ID}:${MUX_TOKEN_SECRET}`),
    },
    body: JSON.stringify({
      cors_origin: '*',
      new_asset_settings: {
        playback_policy: ['public'],
        video_quality: 'basic',
      },
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`MUX Upload Failed: ${error}`);
  }

  const data = await response.json();
  return data;
};