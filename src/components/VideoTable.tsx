import withAuth from "../hoc/PrivateRoute";

type Props = {}

const VideoTable = (props: Props) => {
  return (
    <div>VideoTable</div>
  )
}

export default withAuth(VideoTable);
