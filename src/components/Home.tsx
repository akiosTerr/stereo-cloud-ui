import { useEffect, useState } from "react";
import withAuth from "../hoc/PrivateRoute";
import { FormatedVideoAsset, getMuxVideos, VideoAsset } from "../api/fetchVideos";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const VideoTitle = styled.p`
  color: #fff;
  margin: 0;
`
const Title2 = styled.h2`
  color: #9521f3;
`
const GridVideo = styled.div`
  display: grid;
  grid-gap: 5px;
  grid-template-columns:  repeat(5, 1fr);
  @media (max-width: 1440px) {
    grid-template-columns:  repeat(3, 1fr);
  }
   @media (max-width: 1024px) {
    grid-template-columns:  repeat(2, 1fr);
  }
  @media (max-width: 768px) {
    grid-template-columns:  repeat(1, 1fr);
  }
 
  @media (max-width: 425px) {
    grid-template-columns:  repeat(1, 1fr);
  }
`

const VideoThumbnail = styled.img`
  border-radius: 0.6rem;
  width: 100%;
  height: 250px;
  @media (max-width: 768px) {
    width: 445px;
  }
  @media (max-width: 480px) {
    width: 400px;
  }
`

const VideoBlock = styled.div`
  cursor: pointer;
  display: flex;
  flex-direction: column;
  background-color: transparent;
  padding: 10px;
  border-radius: 0.6rem;
  border: 1px solid transparent;
  max-width: 420px;
  margin: 0 auto;
  &:hover {
    border: 1px solid #fff;
  }
`

const VideoChannelName = styled.p`
  color: #fff;
  margin: 0;
`

const VideoContent = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  gap: 10px;
`

const Button = styled.button`
  background-color: transparent;
  color: #fff;
  border: 1px solid #fff;
  padding: 10px 20px;
  border-radius: 0.6rem;
  cursor: pointer;
`
const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
`
const Loading = styled.p`
  color: #fff;
  margin: 0;
`
const Home = () => {
  const navigate = useNavigate();
  const [videos, setVideos] = useState<FormatedVideoAsset[]>([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  const getThumbUrl = (id: string) => {
    return `https://image.mux.com/${id}/thumbnail.png?width=445&height=250&time=2`
  }

  const handleRedirectVideo = (playbackId: string, description: string = '') => {
    navigate(`/player/${playbackId}`, { state: { description } });
  };

  const updateVideos = async () => {
    setLoading(true);
    const data = await getMuxVideos(1, 10);
    setVideos(data);
    setCurrentPage(1);
    setHasMore(data.length === 10);
    setLoading(false);
  }

  const loadMoreVideos = async () => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    const nextPage = currentPage + 1;
    const data = await getMuxVideos(nextPage, 10);
    
    if (data.length === 0) {
      setHasMore(false);
    } else {
      setVideos(prev => [...prev, ...data]);
      setCurrentPage(nextPage);
      setHasMore(data.length === 10);
    }
    
    setLoading(false);
  }

  useEffect(() => {
    updateVideos()
  }, [])

  return (
    <>
      <GridVideo>
        {videos.map((item) => (
          <VideoBlock key={item.id} onClick={() => {
            handleRedirectVideo(item.playback_id, item.description);
          }}>
            <VideoThumbnail src={getThumbUrl(item.playback_id)} alt="" />
            <VideoContent>
              <VideoTitle>{item.title}</VideoTitle>
              <VideoChannelName>{item.channel_name}</VideoChannelName>
            </VideoContent>
          </VideoBlock>
        ))}
      </GridVideo>
      {hasMore && (
        <ButtonContainer>
          <Button onClick={() => {
            loadMoreVideos()
          }}>
            {loading ? <Loading>Loading...</Loading> : 'Show More Videos'}
          </Button>
        </ButtonContainer>
      )}
    </>
  )
}

export default withAuth(Home);
