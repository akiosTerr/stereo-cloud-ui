import MuxPlayer from "@mux/mux-player-react"
import withAuth from "../hoc/PrivateRoute";

type Props = {}

function Player({ }: Props) {
    return (
        <MuxPlayer
            playbackId="Zex1H9dyvncHoDZMaR3LVjmN4Oby9pw6D2cmPcheiL4"
            metadata={{
                video_title: 'Placeholder (optional)',
                viewer_user_id: 'Placeholder (optional)',
            }}
        />
    )
}

export default withAuth(Player);
