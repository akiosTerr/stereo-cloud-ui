import { useEffect, useState } from "react";
import withAuth from "../hoc/PrivateRoute";
import { getMuxAssets, VideoAsset } from "../api/fetchVideos";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const Title = styled.h2`
  color: #00ec27;
`
const VideoGrid = styled.div`
  display: grid;
  grid-gap: 10px;
  grid-template-columns:  repeat(5, 1fr);
`

const VideoBlock = styled.div`
  background-color: gray;
  padding: 10px;
  border-radius: 0.6rem;
`

const VideoTable = () => {
  const navigate = useNavigate();
  const [videos, setVideos] = useState<VideoAsset[]>([])

  const getThumbUrl = (id: string) => {
    return `https://image.mux.com/${id}/thumbnail.png?width=214&height=121&time=2`
  }

  const handleRedirectVideo = (videoId: string) => {
    navigate(`/player/${videoId}`);
  };

  useEffect(() => {
    getMuxAssets()
      .then((res) => {
        setVideos(res)
      })

  }, [])

  return (
    <>
      <Title>VideoTable</Title>
      <VideoGrid>
        {videos.map((item) => (
          <VideoBlock onClick={() => {
            handleRedirectVideo(item.playback_id);
          }}>
            <img src={getThumbUrl(item.playback_id)} alt="" />
            <p>{item.title}</p>
          </VideoBlock>
        ))}
      </VideoGrid>
    </>
  )
}

export default withAuth(VideoTable);
