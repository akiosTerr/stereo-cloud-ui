import { useEffect, useState } from "react";
import withAuth from "../hoc/PrivateRoute";
import { FormatedVideoAsset, getMuxVideos } from "../api/fetchVideos";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { GridVideo, VideoBlock, VideoChannelName, VideoContent, VideoDuration, VideoThumbnail, VideoTitle } from "../style";


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
const VideoInfoContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
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

  const formatDuration = (duration: number) => {
    const intDuration = parseInt(duration as any, 10);
    const minutes = Math.floor(intDuration / 60);
    const seconds = intDuration % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
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
          <VideoBlock key={item.id} >
            <VideoThumbnail onClick={() => {
              handleRedirectVideo(item.playback_id, item.description);
            }} src={getThumbUrl(item.playback_id)} alt="" />
            <VideoContent>
              <VideoTitle>{item.title}</VideoTitle>
              <VideoInfoContainer>
                <VideoDuration>
                  {typeof item.duration === 'number' ? formatDuration(item.duration) : '--:--'}
                </VideoDuration>
                <VideoChannelName onClick={() => {
                  navigate(`/profile/${item.channel_name}`);
                }}>{item.channel_name}</VideoChannelName>
              </VideoInfoContainer>
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
