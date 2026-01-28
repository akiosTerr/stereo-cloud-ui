import { useEffect, useState } from "react";
import withAuth from "../hoc/PrivateRoute";
import { fetchVideoToken, FormatedVideoAsset, getMuxAssets, getMuxPrivateAssets, getMuxSharedAssets } from "../api/fetchVideos";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { deleteMuxVideo } from "../api/deleteVideo";
import Cookies from "js-cookie";
import ShareModal from "./ShareModal";


const Title = styled.h2`
  color: #00ec27;
`
const Title2 = styled.h2`
  color: #9521f3;
`

const Title3 = styled.h2`
  color: #00bfff;
  margin-top: 2rem;
`
const ChannelName = styled.h2`
  color: #fff;
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
`

const GridVideo = styled.div`
  display: grid;
  grid-gap: 10px;
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
const ButtonRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  background-color: #333;
  padding: 10px;
  border-radius: 0.6rem;
  border: 1px solid transparent;
`

const DeleteButton = styled.button`
  color: red;
  background-color: transparent;
  border: 1px solid transparent;
  &:hover {
    border: 1px solid red;
  }
`

const ShareButton = styled.button`
  color: #04da04;
  background-color: transparent;
  border: 1px solid transparent;
  &:hover {
    border: 1px solid #04da04;
  }
`

const VideoThumbnail = styled.img`
  cursor: pointer;
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

type VideoAssetWithTokens = FormatedVideoAsset & {
  tokenVideo?: string;
  tokenThumbnail?: string;
}


const VideoTable = () => {
  const navigate = useNavigate();
  const [videos, setVideos] = useState<FormatedVideoAsset[]>([])
  const [privateVideos, setPrivateVideos] = useState<VideoAssetWithTokens[]>([])
  const [sharedVideos, setSharedVideos] = useState<VideoAssetWithTokens[]>([])
  const [shareModalOpen, setShareModalOpen] = useState(false)
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null)

  const getThumbUrl = (id: string, isPrivate: boolean = false, videoList: VideoAssetWithTokens[] = []) => {
    if (!isPrivate) {
      return `https://image.mux.com/${id}/thumbnail.png?width=445&height=250&time=2`
    } else {
      const token = videoList.find(v => v.playback_id === id)?.tokenThumbnail || 
                    privateVideos.find(v => v.playback_id === id)?.tokenThumbnail || 
                    sharedVideos.find(v => v.playback_id === id)?.tokenThumbnail || null
      return `https://image.mux.com/${id}/thumbnail.png?width=445&height=250&time=2&token=${token}`
    }
  }

  const handleRedirectVideo = (playbackId: string, isPrivate: boolean = false, description: string = '') => {
    if (isPrivate) {
      const token = privateVideos.find(v => v.playback_id === playbackId)?.tokenVideo ||
                    sharedVideos.find(v => v.playback_id === playbackId)?.tokenVideo
      navigate(`/player/${playbackId}`, { state: { token, description } });
    } else {
      navigate(`/player/${playbackId}`, { state: { description } });
    }
  };

  const signTokens = async (data: FormatedVideoAsset[]) => {
    const promises = data.map(async (item) => {
      const { tokenVideo, tokenThumbnail } = await fetchVideoToken(item.playback_id)
      return {
        ...item,
        tokenVideo,
        tokenThumbnail
      }
    })
    return Promise.all(promises)
  }

  const getChannelName = () => {
    const channelName = Cookies.get('channel_name')
    if (channelName) {
      return channelName
    } else {
      return ''
    }
  }

  const updateVideos = async () => {
    const data = await getMuxAssets();
    setVideos(data);
  }

  const updatePrivateVideos = async () => {
    const data = await getMuxPrivateAssets();
    const signedVideos = await signTokens(data);
    setPrivateVideos(signedVideos);
  }

  const updateSharedVideos = async () => {
    try {
      const data = await getMuxSharedAssets();
      // Filter to only include private videos that need tokens
      const privateSharedVideos = data.filter((video: FormatedVideoAsset) => video.isPrivate);
      const signedVideos = await signTokens(privateSharedVideos);
      setSharedVideos(signedVideos);
    } catch (error) {
      console.error("Failed to fetch shared videos:", error);
      setSharedVideos([]);
    }
  }

  const handleShareClick = (videoId: string) => {
    setSelectedVideoId(videoId);
    setShareModalOpen(true);
  }

  const handleShareModalClose = () => {
    setShareModalOpen(false);
    setSelectedVideoId(null);
  }

  const handleShareUpdate = () => {
    updateSharedVideos();
  }

  useEffect(() => {
    updateVideos()
    updatePrivateVideos()
    updateSharedVideos()
  }, [])

  const handleDelete = async (id: string, asset_id: string) => {
    if (confirm("delete this?")) {
      await deleteMuxVideo(id, asset_id)
      updateVideos()
      updatePrivateVideos()
      updateSharedVideos()
    } else {
      console.log("canceled");
    }
  }

  return (
    <>
      <ChannelName>{getChannelName()}</ChannelName>
      <Title>Public Videos</Title>
      <GridVideo>
        {videos.map((item) => (
          <VideoBlock key={item.id}>
            <div>
              <VideoThumbnail onClick={() => {
                handleRedirectVideo(item.playback_id, item.isPrivate, item.description);
              }} src={getThumbUrl(item.playback_id, item.isPrivate)} alt="" />
              <h2>{item.title}</h2>
            </div>
            <ButtonRow>
              <DeleteButton onClick={() => handleDelete(item.id, item.asset_id)}>Delete</DeleteButton>
              <ShareButton onClick={() => handleShareClick(item.id)}>Share</ShareButton>
            </ButtonRow>
          </VideoBlock>
        ))}
      </GridVideo>
      <Title2>Private Videos</Title2>
      <GridVideo>
        {privateVideos.map((item) => (
          <VideoBlock key={item.id}>
            <div>
              <VideoThumbnail onClick={() => {
                handleRedirectVideo(item.playback_id, item.isPrivate, item.description);
              }} src={getThumbUrl(item.playback_id, item.isPrivate)} alt="" />
              <h2>{item.title}</h2>
            </div>
            <ButtonRow>
              <DeleteButton onClick={() => handleDelete(item.id, item.asset_id)}>Delete</DeleteButton>
              <ShareButton onClick={() => handleShareClick(item.id)}>Share</ShareButton>
            </ButtonRow>
          </VideoBlock>
        ))}
      </GridVideo>
      <Title3>Shared with Me</Title3>
      <GridVideo>
        {sharedVideos.length === 0 ? (
          <div style={{ color: '#aaa', padding: '2rem', textAlign: 'center' }}>
            No videos shared with you yet
          </div>
        ) : (
          sharedVideos.map((item) => (
            <VideoBlock key={item.id}>
              <div>
                <VideoThumbnail onClick={() => {
                  handleRedirectVideo(item.playback_id, item.isPrivate, item.description);
                }} src={getThumbUrl(item.playback_id, item.isPrivate, sharedVideos)} alt="" />
                <h2>{item.title}</h2>
                {(item as any).sharedBy && (
                  <p style={{ color: '#aaa', fontSize: '0.875rem', margin: '0.5rem 0' }}>
                    Shared by: {(item as any).sharedBy.name || (item as any).sharedBy.channel_name}
                  </p>
                )}
              </div>
            </VideoBlock>
          ))
        )}
      </GridVideo>

      {selectedVideoId && (
        <ShareModal
          videoId={selectedVideoId}
          isOpen={shareModalOpen}
          onClose={handleShareModalClose}
          onShareUpdate={handleShareUpdate}
        />
      )}
    </>
  )
}

export default withAuth(VideoTable);
