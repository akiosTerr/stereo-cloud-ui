import MuxPlayer from "@mux/mux-player-react"
import withAuth from "../hoc/PrivateRoute";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { useEffect, useState } from "react";
import { fetchVideoToken } from "../api/fetchVideos";

type Props = {}

const Wrapper = styled.div`
    width: 100%;
    height: auto;
`

function Player({ }: Props) {
    const { playback_id } = useParams()
    const [token, setToken] = useState('')

    const getToken = () => {
        return {
            playback: token
        }
    }

    useEffect(() => {
        fetchVideoToken(playback_id)
            .then(res => setToken(res.token))
    }, [])

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
