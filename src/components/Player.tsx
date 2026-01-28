import MuxPlayer from "@mux/mux-player-react"
import withAuth from "../hoc/PrivateRoute";
import { useLocation, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import styled from "styled-components";
import { fetchVideoInfo } from "../api/fetchVideos";
import CommentsSection from "./CommentsSection";

type Props = {}

const Wrapper = styled.div`
    margin-top: 1rem;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
`

const Description = styled.p`
    width: 95%;
    margin: 0 auto;
    text-align: left;   
    color: #fff;
    background-color: #121213;
    padding: 1rem;
    border-radius: 0.6rem;
    font-size: 1.2rem;
    font-weight: 600;
    margin-top: 1rem;
`

const LoadingMessage = styled.div`
    width: 95%;
    margin: 1rem auto;
    color: #fff;
    text-align: center;
    padding: 2rem;
`

const ErrorMessage = styled.div`
    width: 95%;
    margin: 1rem auto;
    color: #dc3545;
    text-align: center;
    padding: 2rem;
    background-color: #1a1a1b;
    border-radius: 0.6rem;
`

function Player({ }: Props) {
    const location = useLocation();
    const { playbackId } = useParams();
    const videoToken = location.state?.token;
    const description = location.state?.description;
    const [videoId, setVideoId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (playbackId) {
            loadVideoInfo();
        }
    }, [playbackId]);

    const loadVideoInfo = async () => {
        setLoading(true);
        setError(null);
        try {
            const videoInfo = await fetchVideoInfo(playbackId!);
            if (videoInfo && typeof videoInfo === 'object' && 'id' in videoInfo) {
                setVideoId(videoInfo.id as string);
            } else {
                setError('Failed to load video information');
            }
        } catch (err: any) {
            setError(err.message || 'Failed to load video information');
        } finally {
            setLoading(false);
        }
    };

    const getToken = () => {
        return {
            playback: videoToken
        }
    }

    if (!playbackId) {
        return <div>No video ID provided</div>;
    }

    return (
        <Wrapper>
            <MuxPlayer
                style={{ width: '100%', height: '90vh' }}
                accentColor="#9521f3"
                tokens={getToken()}
                playbackId={playbackId}
                metadata={{
                    video_title: 'Placeholder (optional)',
                    viewer_user_id: 'Placeholder (optional)',
                }}
            />
            <Description>{description}</Description>
            {loading ? (
                <LoadingMessage>Loading comments...</LoadingMessage>
            ) : error ? (
                <ErrorMessage>{error}</ErrorMessage>
            ) : videoId ? (
                <CommentsSection videoId={videoId} />
            ) : null}
        </Wrapper>
    )
}

export default withAuth(Player);
