import MuxPlayer from "@mux/mux-player-react"
import withAuth from "../hoc/PrivateRoute";
import { useLocation } from "react-router-dom";
import styled from "styled-components";

type Props = {}

const Wrapper = styled.div`
    width: 100%;
    height: 93vh;
    margin-top: 3rem;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    @media (max-width: 425px) {
        height: 70vh;
        align-items: center;
        margin-top: 0;
    }
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
        </Wrapper>
    )
}

export default withAuth(Player);
