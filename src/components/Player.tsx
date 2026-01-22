import MuxPlayer from "@mux/mux-player-react"
import withAuth from "../hoc/PrivateRoute";
import { useLocation } from "react-router-dom";
import styled from "styled-components";

type Props = {}

const Wrapper = styled.div`
    width: 75vw;
    margin-top: 1rem;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    @media (max-width: 425px) {
        height: 70vh;
        align-items: center;
        margin-top: 0;
    }
`

const Description = styled.p`
    color: #fff;
    font-size: 1.2rem;
    font-weight: 600;
    margin-top: 1rem;
    text-align: center;
`

function Player({ }: Props) {
    const location = useLocation();
    const playback_id = location.state?.playbackId;
    const videoToken = location.state?.token;

    const getToken = () => {
        return {
            playback: videoToken
        }
    }

    if (!playback_id) {
        return <div>No video ID provided</div>;
    }

    return (
        <Wrapper>
            <MuxPlayer
                tokens={getToken()}
                playbackId={playback_id}
                metadata={{
                    video_title: 'Placeholder (optional)',
                    viewer_user_id: 'Placeholder (optional)',
                }}
            />
            <Description>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.</Description>
        </Wrapper>
    )
}

export default withAuth(Player);
