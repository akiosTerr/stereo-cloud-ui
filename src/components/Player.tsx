import MuxPlayer from "@mux/mux-player-react"
import withAuth from "../hoc/PrivateRoute";
import { useParams } from "react-router-dom";

type Props = {}

function Player({ }: Props) {
    const {id} = useParams()
    
    return (
        <MuxPlayer
            playbackId={id}
            metadata={{
                video_title: 'Placeholder (optional)',
                viewer_user_id: 'Placeholder (optional)',
            }}
        />
    )
}

export default withAuth(Player);
