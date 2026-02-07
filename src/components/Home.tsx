import { useEffect, useState } from "react";
import withAuth from "../hoc/PrivateRoute";
import { FormatedVideoAsset, getMuxVideos } from "../api/fetchVideos";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { AiOutlineSearch } from "react-icons/ai";
import { GridVideo, VideoBlock, VideoChannelName, VideoContent, VideoDuration, VideoThumbnail, VideoTitle, TextInput } from "../style";


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
const SearchContainer = styled.div`
  width: 100%;
  max-width: 600px;
  margin: 0 auto 2rem auto;
  display: flex;
  justify-content: center;
  position: relative;
`
const SearchInput = styled(TextInput)`
  width: 100%;
  background-color: rgba(255, 255, 255, 0.1);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 0.75rem 3rem 0.75rem 1rem;
  font-size: 1rem;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }
  
  &:focus {
    border-color: #9521f3;
    background-color: rgba(255, 255, 255, 0.15);
  }
`

const VideoDate = styled.p`
  color: #fff;
  font-size: 0.8rem;
  margin: 0;
`

const VideoHeader = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`

const SearchIcon = styled(AiOutlineSearch)`
  position: absolute;
  right: 1rem;
  top: 1.5rem;
  transform: translateY(-50%);
  color: #fff;
  font-size: 1.25rem;
  pointer-events: none;
`
const Home = () => {
  const navigate = useNavigate();
  const [videos, setVideos] = useState<FormatedVideoAsset[]>([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

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

  const filteredVideos = videos.filter((video) =>
    video.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  return (
    <>
      <SearchContainer>
        <SearchInput
          type="text"
          placeholder="Search videos by title..."
          value={searchQuery} 
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <SearchIcon />
      </SearchContainer>
      <GridVideo>
        {filteredVideos.map((item) => (
          <VideoBlock key={item.id} >
            <VideoThumbnail onClick={() => {
              handleRedirectVideo(item.playback_id, item.description);
            }} src={getThumbUrl(item.playback_id)} alt="" />
            <VideoContent>
                <VideoHeader>
                  <VideoTitle>{item.title}</VideoTitle>
                  <VideoDuration>
                      {typeof item.duration === 'number' ? formatDuration(item.duration) : '--:--'}
                    </VideoDuration>
                </VideoHeader>
                <VideoInfoContainer>
                <VideoChannelName onClick={() => {
                  navigate(`/profile/${item.channel_name}`);
                }}>{item.channel_name}</VideoChannelName>
                <VideoDate>{formatDate(item.created_at)}</VideoDate>
              </VideoInfoContainer>
            </VideoContent>
          </VideoBlock>
        ))}
      </GridVideo>
      {hasMore && !searchQuery && (
        <ButtonContainer>
          <Button onClick={() => {
            loadMoreVideos()
          }}>
            {loading ? <Loading>Loading...</Loading> : 'Show More Videos'}
          </Button>
        </ButtonContainer>
      )}
      {searchQuery && filteredVideos.length === 0 && (
        <ButtonContainer>
          <Loading>No videos found matching "{searchQuery}"</Loading>
        </ButtonContainer>
      )}
    </>
  )
}

export default withAuth(Home);
