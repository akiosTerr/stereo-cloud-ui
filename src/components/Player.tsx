import MuxPlayer from "@mux/mux-player-react"
import withAuth from "../hoc/PrivateRoute";
import { useLocation, useParams } from "react-router-dom";
import styled from "styled-components";

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

function Player({ }: Props) {
    const location = useLocation();
    const { playbackId } = useParams();
    const videoToken = location.state?.token;
    const description = location.state?.description;

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
        </Wrapper>
    )
}

export default withAuth(Player);
