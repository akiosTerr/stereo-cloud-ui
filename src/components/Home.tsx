import { useEffect, useState } from "react";
import withAuth from "../hoc/PrivateRoute";
import { getMuxVideos, VideoAsset } from "../api/fetchVideos";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const Title = styled.h2`
  color: #00ec27;
`
const Title2 = styled.h2`
  color: #9521f3;
`
const GridVideo = styled.div`
  display: grid;
  grid-gap: 5px;
  grid-template-columns:  repeat(4, 1fr);
  @media (max-width: 768px) {
    grid-template-columns:  repeat(1, 1fr);
  }
`

const VideoThumbnail = styled.img`
  border-radius: 0.6rem;
  width: 445px;
  height: 250px;
`

const VideoBlock = styled.div`
  cursor: pointer;
  display: flex;
  flex-direction: column;
  background-color: transparent;
  padding: 10px;
  border-radius: 0.6rem;
  border: 1px solid transparent;
  &:hover {
    border: 1px solid #fff;
  }
`


const Home = () => {
  const navigate = useNavigate();
  const [videos, setVideos] = useState<VideoAsset[]>([])

  const getThumbUrl = (id: string) => {
    return `https://image.mux.com/${id}/thumbnail.png?width=445&height=250&time=2`
  }

  const handleRedirectVideo = (playbackId: string, description: string = '') => {
    navigate(`/player/${playbackId}`, { state: { description } });
  };

  const updateVideos = async () => {
    const data = await getMuxVideos();
    setVideos(data);
  }

  useEffect(() => {
    updateVideos()
  }, [])

  return (
    <GridVideo>
      {videos.map((item) => (
        <VideoBlock key={item.id} onClick={() => {
          handleRedirectVideo(item.playback_ids[0].id, item.description);
        }}>
          <div>
            <VideoThumbnail src={getThumbUrl(item.playback_ids[0].id)} alt="" />
            <h2>{item.meta.title}</h2>
          </div>
        </VideoBlock>
      ))}
    </GridVideo>
  )
}

export default withAuth(Home);
