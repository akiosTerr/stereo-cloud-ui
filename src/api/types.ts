export type MuxAssetResponse = {
    data: MuxAsset[];
};

export type MuxAsset = {
    video_quality: VideoQuality;
    upload_id: string;
    tracks: Track[];
    test: boolean;
    status: AssetStatus;
    resolution_tier: ResolutionTier;
    progress: {
        state: ProgressState;
    };
    playback_ids: PlaybackId[];
    mp4_support: Mp4Support;
    meta: {
        title: string;
        creator_id: string;
    };
    max_stored_resolution: StoredResolution;
    max_stored_frame_rate: number;
    max_resolution_tier: ResolutionTier;
    master_access: MasterAccess;
    ingest_type: IngestType;
    id: string;
    encoding_tier: EncodingTier;
    duration: number;
    created_at: string;
    aspect_ratio: string;
};

type PlaybackId = {
    policy: PlaybackPolicy;
    id: string;
};

type Track = VideoTrack | AudioTrack;

type VideoTrack = {
    type: 'video';
    max_width: number;
    max_height: number;
    max_frame_rate: number;
    id: string;
    duration: number;
};

type AudioTrack = {
    type: 'audio';
    status: TrackStatus;
    primary: boolean;
    name: string;
    max_channels: number;
    language_code: string;
    id: string;
};

// Enums / Literal Types

type VideoQuality = 'basic' | 'standard' | 'high';
type AssetStatus = 'preparing' | 'ready' | 'errored';
type ResolutionTier = '144p' | '240p' | '360p' | '480p' | '720p' | '1080p' | '1440p' | '2160p';
type StoredResolution = 'SD' | 'HD' | 'FHD' | 'UHD';
type Mp4Support = 'none' | 'standard' | 'fallback';
type MasterAccess = 'none' | 'temporary' | 'persistent';
type IngestType = 'on_demand_direct_upload' | 'stream_live';
type EncodingTier = 'baseline' | 'enhanced' | 'professional';
type PlaybackPolicy = 'public' | 'signed';
type ProgressState = 'waiting' | 'preparing' | 'ready' | 'completed' | 'errored';
type TrackStatus = 'preparing' | 'ready' | 'errored';
