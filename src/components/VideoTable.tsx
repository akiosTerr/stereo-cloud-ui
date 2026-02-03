import { useEffect, useState } from "react";
import withAuth from "../hoc/PrivateRoute";
import { fetchVideoToken, FormatedVideoAsset, getMuxAssets, getMuxPrivateAssets, getMuxSharedAssets } from "../api/fetchVideos";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { deleteMuxVideo } from "../api/deleteVideo";
import Cookies from "js-cookie";
import ShareModal from "./ShareModal";
import DeleteModal, { type DeleteModalVideo } from "./DeleteModal";


const Title = styled.h2`
  color: #00ec27;
`
const Title2 = styled.h2`
  color: #9521f3;
`
const Title3 = styled.h2`
  color: #00bfff;
`
const VideoTitle = styled.p`
  color: #fff;
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1rem;
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

const EmptyMessage = styled.p`
  color:rgba(255, 255, 255, 0.55);
  padding: 2rem;
  text-align: center;
  grid-column: span 5;
  margin: 0;
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

const GetURLButton = styled.button`
  color: #048cda;
  background-color: transparent;
  border: 1px solid transparent;
  &:hover {
    border: 1px solid #048cda;
  }
`

const CopyLabel = styled.span`
  display: inline-block;
  animation: fadeScale 0.35s ease-out;
  @keyframes fadeScale {
    0% {
      opacity: 0;
      transform: scale(0.85);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
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
    width: 350px;
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
  const [copiedPlaybackId, setCopiedPlaybackId] = useState<string | null>(null)
  const [videoToDelete, setVideoToDelete] = useState<DeleteModalVideo | null>(null)

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

  const sharePublicVideo = async (playbackId: string) => {
    try {
      const url = `${window.location.origin}/player/${playbackId}`;
      await navigator.clipboard.writeText(url);
      setCopiedPlaybackId(playbackId);
      setTimeout(() => setCopiedPlaybackId(null), 1500);
    } catch (error) {
      console.error('Failed to copy URL: ', error);
      alert('Failed to copy video URL.');
    }
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

  const handleDeleteClick = (video: { id: string; asset_id: string; title: string }) => {
    setVideoToDelete(video);
  }

  const handleDeleteConfirm = async (id: string, asset_id: string) => {
    await deleteMuxVideo(id, asset_id);
    updateVideos();
    updatePrivateVideos();
    updateSharedVideos();
  }

  const handleDeleteModalClose = () => {
    setVideoToDelete(null);
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
              <VideoTitle>{item.title}</VideoTitle>
            </div>
            <ButtonRow>
              <DeleteButton onClick={() => handleDeleteClick({ id: item.id, asset_id: item.asset_id, title: item.title })}>Delete</DeleteButton>
              <GetURLButton onClick={() => sharePublicVideo(item.playback_id)}>
                <CopyLabel key={copiedPlaybackId === item.playback_id ? "copied" : "url"}>
                  {copiedPlaybackId === item.playback_id ? "Copied" : "Get URL"}
                </CopyLabel>
              </GetURLButton>
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
              <VideoTitle>{item.title}</VideoTitle>
            </div>
            <ButtonRow>
              <DeleteButton onClick={() => handleDeleteClick({ id: item.id, asset_id: item.asset_id, title: item.title })}>Delete</DeleteButton>
              <ShareButton onClick={() => handleShareClick(item.id)}>Share</ShareButton>
            </ButtonRow>
          </VideoBlock>
        ))}
      </GridVideo>
      <Title3>Shared with Me</Title3>
      <GridVideo>
        {sharedVideos.length === 0 ? (
          <EmptyMessage>
            No videos shared with you yet
          </EmptyMessage>
        ) : (
          sharedVideos.map((item) => (
            <VideoBlock key={item.id}>
              <div>
                <VideoThumbnail onClick={() => {
                  handleRedirectVideo(item.playback_id, item.isPrivate, item.description);
                }} src={getThumbUrl(item.playback_id, item.isPrivate, sharedVideos)} alt="" />
                <VideoTitle>{item.title}</VideoTitle>
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

      <DeleteModal
        isOpen={!!videoToDelete}
        video={videoToDelete}
        onClose={handleDeleteModalClose}
        onConfirm={handleDeleteConfirm}
      />
    </>
  )
}

export default withAuth(VideoTable);
