import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { fetchVideosByChannelName, FormatedVideoAsset } from "../api/fetchVideos";
import { GridVideo, VideoBlock, VideoContent, VideoDuration, VideoThumbnail, VideoTitle } from "../style";
import withAuth from "../hoc/PrivateRoute";

const WrapProfilePage = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 24px;
`

const VideoInfoContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: 100%;
`

const VideoDate = styled.p`
    font-size: 12px;
    color: #666;
`

function ProfilePage() {
    const [videos, setVideos] = useState<FormatedVideoAsset[]>([]);
    const { channel_name } = useParams();
    const navigate = useNavigate();

    const handleRedirectVideo = (playbackId: string, description: string = '') => {
        navigate(`/player/${playbackId}`, { state: { description } });
    };

    const getThumbUrl = (id: string) => {
        return `https://image.mux.com/${id}/thumbnail.png?width=445&height=250&time=2`
    }

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    }

    useEffect(() => {
        const fetchVideos = async () => {
            const data = await fetchVideosByChannelName(channel_name);
            setVideos(data);
        }
        fetchVideos();
    }, []);

    const formatDuration = (duration: number) => {
        const intDuration = parseInt(duration as any, 10);
        const minutes = Math.floor(intDuration / 60);
        const seconds = intDuration % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }


    return (
        <WrapProfilePage>
            <h1>{channel_name}</h1>
            <GridVideo>
                {videos.map((item) => (
                    <VideoBlock key={item.id} onClick={() => {
                        handleRedirectVideo(item.playback_id, item.description);
                    }}>
                        <VideoThumbnail src={getThumbUrl(item.playback_id)} alt="" />
                        <VideoContent>
                            <VideoTitle>{item.title}</VideoTitle>
                            <VideoInfoContainer>
                                <VideoDuration>
                                    {typeof item.duration === 'number' ? formatDuration(item.duration) : '--:--'}
                                </VideoDuration>
                                <VideoDate>{formatDate(item.created_at)}</VideoDate>
                            </VideoInfoContainer>
                        </VideoContent>
                    </VideoBlock>
                ))}
            </GridVideo>
        </WrapProfilePage>
    );
}

export default withAuth(ProfilePage);